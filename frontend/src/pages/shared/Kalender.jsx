import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
const fullMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Juni 2026 sebagai default

  const [holidays, setHolidays] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch real public holidays for Indonesia
    const fetchHolidays = async () => {
      try {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentDate.getFullYear()}/ID`);
        if (response.ok) {
          const data = await response.json();
          const formattedHolidays = data.map(h => {
            const d = new Date(h.date);
            return {
              day: d.getDate(),
              month: d.getMonth(),
              year: d.getFullYear(),
              title: h.localName,
              type: 'bahaya',
              tag: 'Hari Libur'
            };
          });
          setHolidays(formattedHolidays);
        }
      } catch (error) {
        console.error("Gagal mengambil data hari libur:", error);
      }
    };
    fetchHolidays();
  }, [currentDate.getFullYear()]);

  const academicEvents = [
    { day: 9, month: 5, year: 2026, title: 'Deadline Tugas 3: React Router', type: 'peringatan', tag: 'Tugas' },
    { day: 15, month: 5, year: 2026, title: 'Ujian Tengah Semester', type: 'info', tag: 'Akademik' },
    { day: 20, month: 5, year: 2026, title: 'Kuis 2: PBO Java', type: 'kuis', tag: 'Kuis' },
    { day: 28, month: 5, year: 2026, title: 'Deadline Makalah Basis Data', type: 'peringatan', tag: 'Tugas' },
  ];

  const events = [...holidays, ...academicEvents];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust so Monday is 0 and Sunday is 6
  firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Filter events for current month and year
  const currentEvents = events.filter(e => e.month === currentMonth && e.year === currentYear);

  return (
    <div>
      <style>{`
        @keyframes fadeInSmooth {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-smooth {
          animation: fadeInSmooth 0.3s ease-out forwards;
        }
      `}</style>
      <PageHeader title="Kalender Kampus" subtitle="Jadwal akademik dan tenggat tugas Anda" />
      
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up-fade">
          <div className="lg:col-span-2">
            <Card className="p-5">
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-32 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
              <Skeleton className="h-[300px] w-full rounded-2xl" />
            </Card>
          </div>
          <div>
            <Card className="p-5">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <div className="space-y-4">
                {Array(4).fill(0).map((_, i) => (
                  <div key={`skel-event-${i}`} className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up-fade">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card noPadding>
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center relative">
              <button onClick={prevMonth} className="hidden sm:flex px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-primary rounded-lg transition-colors items-center gap-1"><ChevronLeft size={16} /> Sebelumnya</button>
              <button onClick={prevMonth} className="sm:hidden p-2 text-slate-600 hover:bg-slate-100 hover:text-primary rounded-lg transition-colors"><ChevronLeft size={18} /></button>
              
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                {/* Month Dropdown */}
                <div className="relative group">
                  <select 
                    value={currentMonth}
                    onChange={(e) => setCurrentDate(new Date(currentYear, parseInt(e.target.value), 1))}
                    className="appearance-none bg-slate-50 border border-slate-200 hover:border-primary/50 text-slate-700 font-medium text-[13px] py-1.5 pl-3 pr-7 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/10 cursor-pointer transition-all outline-none"
                  >
                    {fullMonths.map((m, idx) => <option key={m} value={idx}>{m}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" />
                </div>
                {/* Year Dropdown */}
                <div className="relative group">
                  <select 
                    value={currentYear}
                    onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentMonth, 1))}
                    className="appearance-none bg-slate-50 border border-slate-200 hover:border-primary/50 text-slate-700 font-medium text-[13px] py-1.5 pl-3 pr-7 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/10 cursor-pointer transition-all outline-none"
                  >
                    {[2024, 2025, 2026, 2027, 2028, 2029].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" />
                </div>
              </div>

              <button onClick={nextMonth} className="hidden sm:flex px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-primary rounded-lg transition-colors items-center gap-1">Selanjutnya <ChevronRight size={16} /></button>
              <button onClick={nextMonth} className="sm:hidden p-2 text-slate-600 hover:bg-slate-100 hover:text-primary rounded-lg transition-colors"><ChevronRight size={18} /></button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-3">
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(d => <div key={d} className="py-2">{d}</div>)}
              </div>
              <div key={currentDate.toISOString()} className="grid grid-cols-7 gap-1 animate-fade-in-smooth">
                {/* Empty days at start of month */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const hasEvent = currentEvents.find(e => e.day === day);
                  const isToday = currentMonth === 5 && currentYear === 2026 && day === 15; // Simulate today as 15 June 2026
                  return (
                    <div 
                      key={day} 
                      className={`relative aspect-square flex items-center justify-center rounded-xl text-sm transition-colors cursor-pointer ${
                        hasEvent ? 'bg-primary/10 text-primary font-medium hover:bg-primary/20' : 'text-slate-700 hover:bg-slate-100'
                      } ${isToday ? 'ring-2 ring-primary' : ''}`}
                    >
                      {day}
                      {hasEvent && <div className="absolute bottom-1 w-1.5 h-1.5 bg-primary rounded-full" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <Card noPadding>
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-medium text-slate-800">Agenda Mendatang</h3>
            </div>
            <div className="p-4 space-y-3">
              {currentEvents.length > 0 ? currentEvents.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="bg-slate-100 text-center p-2 rounded-xl min-w-[3.5rem] shrink-0">
                    <div className="text-[10px] font-medium text-slate-400 uppercase">{months[event.month]}</div>
                    <div className="text-xl font-medium text-slate-800">{event.day}</div>
                  </div>
                  <div>
                    <Badge type={event.type} label={event.tag} />
                    <h4 className="font-semibold text-slate-800 text-sm mt-1 leading-snug">{event.title}</h4>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 text-slate-500 text-sm">Tidak ada agenda di bulan ini.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
};

export default Kalender;

