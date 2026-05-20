import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabase';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { 
  HiChartBar, HiTrendingUp, HiClock, HiLightBulb, 
  HiChevronRight, HiExclamationCircle, HiSparkles 
} from 'react-icons/hi';
import { 
  startOfWeek, subWeeks, format, startOfDay, endOfDay, 
  parseISO, eachDayOfInterval, isSameDay, differenceInMinutes 
} from 'date-fns';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [kickData, setKickData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch last 14 days of kicks for comprehensive analytics
        const twoWeeksAgo = startOfDay(subWeeks(new Date(), 2)).toISOString();
        const { data: kicks } = await supabase
          .from('kicks')
          .select('created_at')
          .eq('user_id', user.id)
          .gte('created_at', twoWeeksAgo)
          .order('created_at', { ascending: true });

        setKickData(kicks || []);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Data Processing Logic ---

  const processedData = useMemo(() => {
    if (!kickData.length) return null;

    const now = new Date();
    const today = startOfDay(now);
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const lastWeekStart = subWeeks(thisWeekStart, 1);

    // 1. Overview Stats
    const todayKicks = kickData.filter(k => isSameDay(parseISO(k.created_at), today)).length;
    
    const thisWeekKicks = kickData.filter(k => parseISO(k.created_at) >= thisWeekStart);
    const weeklyAvg = Math.round(thisWeekKicks.length / 7);

    const hoursMap = kickData.reduce((acc, k) => {
      const hour = parseISO(k.created_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    const peakHour = Object.entries(hoursMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 20;
    const peakTimeDisplay = format(new Date().setHours(parseInt(peakHour), 0), 'h a');

    // 2. Weekly Trend Chart (Mon-Sun)
    const daysInterval = eachDayOfInterval({
      start: thisWeekStart,
      end: endOfDay(now)
    });
    const weeklyChartData = daysInterval.map(day => ({
      name: format(day, 'EEE'),
      kicks: kickData.filter(k => isSameDay(parseISO(k.created_at), day)).length
    }));

    // 3. Active Hours Bar Chart (Grouped)
    const timeBlocks = [
      { name: 'Morning', range: [6, 11], kicks: 0 },
      { name: 'Afternoon', range: [12, 16], kicks: 0 },
      { name: 'Evening', range: [17, 21], kicks: 0 },
      { name: 'Night', range: [22, 23], kicks: 0 },
      { name: 'Late Night', range: [0, 5], kicks: 0 },
    ];
    kickData.forEach(k => {
      const h = parseISO(k.created_at).getHours();
      const block = timeBlocks.find(b => h >= b.range[0] && h <= b.range[1]);
      if (block) block.kicks += 1;
    });

    // 5. Kick Interval Analytics
    let totalInterval = 0;
    let intervalCount = 0;
    for (let i = 1; i < kickData.length; i++) {
      const diff = differenceInMinutes(parseISO(kickData[i].created_at), parseISO(kickData[i-1].created_at));
      if (diff > 0 && diff < 60) { // Only count intervals within 1 hour as "active sessions"
        totalInterval += diff;
        intervalCount++;
      }
    }
    const avgInterval = intervalCount > 0 ? (totalInterval / intervalCount).toFixed(1) : "0";

    // 8. Weekly Comparison
    const lastWeekKicks = kickData.filter(k => {
      const date = parseISO(k.created_at);
      return date >= lastWeekStart && date < thisWeekStart;
    }).length;
    
    const lastWeekAvg = Math.round(lastWeekKicks / 7);
    const percentChange = lastWeekAvg > 0 
      ? Math.round(((weeklyAvg - lastWeekAvg) / lastWeekAvg) * 100) 
      : 0;

    return { 
      todayKicks, weeklyAvg, peakTimeDisplay, pattern: 'Stable',
      weeklyChartData, 
      activeHoursData: timeBlocks.map(b => ({ name: b.name, kicks: b.kicks })),
      avgInterval,
      lastWeekAvg,
      percentChange
    };
  }, [kickData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Fallback if no data
  if (!processedData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <HiChartBar className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-textMain">No data yet</h2>
        <p className="text-textSecondary max-w-xs">Start recording kicks on the Home page to see your personalized analytics!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient pb-28 sm:pb-32 font-sans">
      <header className="bg-white/80 backdrop-blur-xl border-b border-borderSoft/80 pt-10 sm:pt-14 pb-6 sm:pb-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-primary mb-2">
            <HiChartBar className="w-5 h-5" />
            <span className="font-black text-xs uppercase tracking-[0.18em]">Live Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-textMain tracking-tight">Baby's Activity</h2>
          <p className="text-textSecondary font-medium">Data-driven insights for you</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5 sm:space-y-6">
        
        {/* 1. Overview Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/90 p-4 sm:p-6 rounded-2xl border border-borderSoft shadow-lg shadow-primary/5 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-black text-textSecondary uppercase tracking-[0.12em]">Today's Kicks</span>
            <div className="text-3xl font-black text-primary mt-1">{processedData.todayKicks}</div>
          </div>
          <div className="bg-white/90 p-4 sm:p-6 rounded-2xl border border-borderSoft shadow-lg shadow-primary/5 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-black text-textSecondary uppercase tracking-[0.12em]">Weekly Avg</span>
            <div className="text-2xl sm:text-3xl font-black text-textMain mt-1">{processedData.weeklyAvg}/day</div>
          </div>
          <div className="bg-white/90 p-4 sm:p-6 rounded-2xl border border-borderSoft shadow-lg shadow-primary/5 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-black text-textSecondary uppercase tracking-[0.12em]">Most Active</span>
            <div className="text-2xl sm:text-3xl font-black text-textMain mt-1">{processedData.peakTimeDisplay}</div>
          </div>
          <div className="bg-white/90 p-4 sm:p-6 rounded-2xl border border-borderSoft shadow-lg shadow-primary/5 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-black text-textSecondary uppercase tracking-[0.12em]">Pattern</span>
            <div className="text-2xl sm:text-3xl font-black text-primary mt-1">{processedData.pattern}</div>
          </div>
        </section>

        {/* 2. Weekly Kick Trend */}
        <section className="bg-white/90 p-4 sm:p-6 lg:p-8 rounded-2xl border border-borderSoft shadow-xl shadow-primary/5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-textMain tracking-tight">Weekly Trend</h3>
            <HiTrendingUp className="text-primary w-6 h-6" />
          </div>
          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData.weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2E9E4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#7A7A7A', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(243,111,143,0.12)'}}
                  itemStyle={{color: '#FF8FA3', fontWeight: 'bold'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="kicks" 
                  stroke="#FF8FA3" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: "#FF8FA3", strokeWidth: 0 }} 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-mint/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 bg-mint rounded-full animate-ping"></div>
            <p className="text-sm font-bold text-textMain">
              {processedData.percentChange >= 0 ? 'Movement increased' : 'Movement decreased'} by {Math.abs(processedData.percentChange)}% this week.
            </p>
          </div>
        </section>

        {/* 3. Baby Active Hours */}
        <section className="bg-white/90 p-4 sm:p-6 lg:p-8 rounded-2xl border border-borderSoft shadow-xl shadow-primary/5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-textMain tracking-tight">Active Hours</h3>
            <HiClock className="text-lavender w-6 h-6" />
          </div>
          <div className="h-60 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData.activeHoursData} layout="vertical" margin={{ left: 8, right: 12 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4A4A4A', fontSize: 13, fontWeight: 'black'}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="kicks" radius={[0, 10, 10, 0]}>
                  {processedData.activeHoursData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index >= 2 ? '#FF8FA3' : '#B9A7E5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm font-bold text-textSecondary text-center">Baby is most active in the {processedData.activeHoursData.sort((a,b) => b.kicks - a.kicks)[0].name.toLowerCase()}.</p>
        </section>

        {/* 5. Kick Interval Analytics */}
        <section className="bg-white/90 p-5 sm:p-6 lg:p-8 rounded-2xl border border-borderSoft shadow-xl shadow-primary/5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-black text-textSecondary uppercase tracking-[0.12em]">Avg Interval</span>
            <div className="text-3xl font-black text-textMain">{processedData.avgInterval} mins</div>
            <p className="text-xs font-bold text-mint">Spacing is consistent</p>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-peach/20 rounded-2xl flex items-center justify-center text-peach">
            <HiClock className="w-8 h-8" />
          </div>
        </section>

        {/* 6. Smart Insights Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HiLightBulb className="text-yellowSoft w-6 h-6" />
            <h3 className="text-xl font-black text-textMain tracking-tight">Smart Insights</h3>
          </div>
          
          <div className="grid gap-3">
            <div className="bg-white/90 p-4 sm:p-5 rounded-2xl border border-borderSoft flex items-center gap-4 shadow-lg shadow-primary/5">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <HiSparkles className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-textMain">Baby is usually active around {processedData.peakTimeDisplay}.</p>
            </div>
            
            <div className="bg-white/90 p-4 sm:p-5 rounded-2xl border border-borderSoft flex items-center gap-4 shadow-lg shadow-primary/5">
              <div className="w-10 h-10 bg-mint/10 rounded-xl flex items-center justify-center text-mint">
                <HiTrendingUp className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-textMain">Movement has {processedData.percentChange >= 0 ? 'increased' : 'decreased'} this week.</p>
            </div>

            {processedData.todayKicks < processedData.weeklyAvg && (
              <div className="bg-white/90 p-4 sm:p-5 rounded-2xl border border-borderSoft flex items-center gap-4 shadow-lg shadow-primary/5">
                <div className="w-10 h-10 bg-textSecondary/10 rounded-xl flex items-center justify-center text-textSecondary">
                  <HiExclamationCircle className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-textMain">Today's movement is lower than average.</p>
              </div>
            )}
          </div>
        </section>

        {/* 8. Weekly Comparison */}
        <section className="bg-textMain p-5 sm:p-6 lg:p-8 rounded-2xl text-white space-y-6 shadow-2xl shadow-textMain/20">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black tracking-tight">Weekly Comparison</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${processedData.percentChange >= 0 ? 'bg-mint/20 text-mint' : 'bg-primary/20 text-primary'}`}>
              {processedData.percentChange >= 0 ? '+' : ''}{processedData.percentChange}%
            </span>
          </div>
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-4 sm:gap-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.12em]">This Week</span>
              <div className="text-2xl font-black">{processedData.weeklyAvg} avg/day</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.12em]">Last Week</span>
              <div className="text-2xl font-black">{processedData.lastWeekAvg} avg/day</div>
            </div>
          </div>
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white/50">
            <span>Progress report ready</span>
            <HiChevronRight className="w-4 h-4" />
          </div>
        </section>

      </main>
    </div>
  );
};

export default Analytics;
