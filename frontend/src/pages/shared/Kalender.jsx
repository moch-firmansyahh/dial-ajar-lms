import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Calendar as CalendarIcon } from 'lucide-react';

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
const fullMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Juni 2026 sebagai default

  const events = [
    { day: 1, month: 5, year: 2026, title: 'Hari Lahir Pancasila', type: 'bahaya', tag: 'Hari Libur' },
    { day: 9, month: 5, year: 2026, title: 'Deadline Tugas 3: React Router', type: 'peringatan', tag: 'Tugas' },
    { day: 15, month: 5, year: 2026, title: 'Ujian Tengah Semester', type: 'info', tag: 'Akademik' },
    { day: 20, month: 5, year: 2026, title: 'Kuis 2: PBO Java', type: 'kuis', tag: 'Kuis' },
    { day: 28, month: 5, year: 2026, title: 'Deadline Makalah Basis Data', type: 'peringatan', tag: 'Tugas' },
  ];

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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card noPadding>
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-medium text-slate-800">{fullMonths[currentMonth]} {currentYear}</h3>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">← Sebelumnya</button>
                <button onClick={nextMonth} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Selanjutnya →</button>
              </div>
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
    </div>
  );
};

export default Kalender;

