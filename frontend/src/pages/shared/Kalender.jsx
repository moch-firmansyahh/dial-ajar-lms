import React, { useState, useEffect, useRef } from 'react';
import Holidays from 'date-holidays';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { getKalenderEvents } from '../../api/kalender.api';

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
const fullMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Juni 2026 sebagai default
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (monthRef.current && !monthRef.current.contains(event.target)) {
        setShowMonthPicker(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target)) {
        setShowYearPicker(false);
      }
    };
    if (showMonthPicker || showYearPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMonthPicker, showYearPicker]);

  const [holidays, setHolidays] = useState([]);

  const { user } = useAuthStore();

  const { data: academicEventsData, isLoading: queryLoading } = useQuery({
    queryKey: ['kalender', user?.id],
    queryFn: () => getKalenderEvents(user.id, user.role),
    enabled: !!user?.id
  });

  const isLoading = queryLoading || !user;

  useEffect(() => {
    // Generate holidays using date-holidays library
    const hd = new Holidays('ID');
    const year = currentDate.getFullYear();
    const hdList = hd.getHolidays(year);
    
    // Convert to our format
    const formattedHolidays = hdList.map(h => {
      const d = new Date(h.date);
      return {
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        title: h.name,
        type: 'libur',
        tag: 'Hari Libur'
      };
    });

    // Add specific national days requested by user
    const nationalDays = [
      { date: new Date(year, 9, 28), name: "Hari Sumpah Pemuda" }, // 28 Oktober
      { date: new Date(year, 3, 21), name: "Hari Kartini" }, // 21 April
      { date: new Date(year, 4, 2), name: "Hari Pendidikan Nasional" }, // 2 Mei
      { date: new Date(year, 9, 2), name: "Hari Batik Nasional" }, // 2 Oktober
      { date: new Date(year, 10, 10), name: "Hari Pahlawan" }, // 10 November
      { date: new Date(year, 10, 25), name: "Hari Guru Nasional" } // 25 November
    ];

    const extraHolidays = nationalDays.map(h => ({
      day: h.date.getDate(),
      month: h.date.getMonth(),
      year: h.date.getFullYear(),
      title: h.name,
      type: 'libur',
      tag: 'Peringatan Nasional'
    }));

    setHolidays([...formattedHolidays, ...extraHolidays]);
  }, [currentDate.getFullYear()]);

  const academicEvents = academicEventsData || [];

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
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center relative z-20">
              <button onClick={prevMonth} className="hidden sm:flex px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-primary rounded-lg transition-colors items-center gap-1"><ChevronLeft size={16} /> Sebelumnya</button>
              <button onClick={prevMonth} className="sm:hidden p-2 text-slate-600 hover:bg-slate-100 hover:text-primary rounded-lg transition-colors"><ChevronLeft size={18} /></button>
              
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                {/* Month Dropdown Custom */}
                <div className="relative" ref={monthRef}>
                  <button 
                    onClick={() => { setShowMonthPicker(!showMonthPicker); setShowYearPicker(false); }}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-primary/50 text-slate-700 font-medium text-[13px] py-1.5 pl-3 pr-2.5 rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-primary/10"
                  >
                    <span className="w-16 text-left">{fullMonths[currentMonth]}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showMonthPicker ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  {showMonthPicker && (
                    <div className="absolute top-full mt-1.5 left-0 w-36 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200 max-h-64 overflow-y-auto custom-scrollbar">
                      {fullMonths.map((m, idx) => (
                        <button
                          key={m}
                          onClick={() => {
                            setCurrentDate(new Date(currentYear, idx, 1));
                            setShowMonthPicker(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                            currentMonth === idx 
                              ? 'bg-primary/10 text-primary font-semibold' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Year Dropdown Custom */}
                <div className="relative" ref={yearRef}>
                  <button 
                    onClick={() => { setShowYearPicker(!showYearPicker); setShowMonthPicker(false); }}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-primary/50 text-slate-700 font-medium text-[13px] py-1.5 pl-3 pr-2.5 rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-primary/10"
                  >
                    <span>{currentYear}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showYearPicker ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  {showYearPicker && (
                    <div className="absolute top-full mt-1.5 left-0 w-28 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200 max-h-64 overflow-y-auto custom-scrollbar">
                      {[2024, 2025, 2026, 2027, 2028, 2029].map((y) => (
                        <button
                          key={y}
                          onClick={() => {
                            setCurrentDate(new Date(y, currentMonth, 1));
                            setShowYearPicker(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                            currentYear === y 
                              ? 'bg-primary/10 text-primary font-semibold' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  )}
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
                  const dayEvents = currentEvents.filter(e => e.day === day);
                  const isToday = currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() && day === new Date().getDate();
                  const isSunday = new Date(currentYear, currentMonth, day).getDay() === 0;
                  const isHoliday = dayEvents.some(e => e.type === 'libur');
                  const isRedDay = isSunday || isHoliday;
                  const academicEvent = dayEvents.find(e => e.type !== 'libur');

                  return (
                    <div 
                      key={day} 
                      className={`relative aspect-square flex items-center justify-center rounded-xl text-sm transition-colors cursor-pointer ${
                        academicEvent 
                          ? academicEvent.type === 'kuis' ? 'bg-amber-50 text-amber-600 font-medium hover:bg-amber-100' 
                          : academicEvent.type === 'tugas' ? 'bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100'
                          : 'bg-slate-100 text-slate-600 font-medium hover:bg-slate-200' 
                        : isRedDay ? 'bg-red-50 text-red-600 font-medium hover:bg-red-100'
                        : 'text-slate-700 hover:bg-slate-100'
                      } ${isToday ? 'ring-2 ring-primary' : ''}`}
                    >
                      {day}
                      {academicEvent && (
                        <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                          academicEvent.type === 'kuis' ? 'bg-red-500' :
                          academicEvent.type === 'tugas' ? 'bg-indigo-500' : 'bg-slate-400'
                        }`} />
                      )}
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
                    <Badge type={event.type === 'kuis' ? 'bahaya' : event.type === 'tugas' ? 'info' : event.type} label={event.tag} />
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

