import { CalendarDays, ChevronLeft, ChevronRight, History, Search, Trash2 } from "lucide-react";
import { useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Workout } from "../types/workout";

type HistoryPageProps = {
	workouts: Workout[];
	totalSets: number;
	search: string;
	calendarOpen: boolean;
	calendarMonth: Date;
	setSearch: Dispatch<SetStateAction<string>>;
	setCalendarOpen: Dispatch<SetStateAction<boolean>>;
	setCalendarMonth: Dispatch<SetStateAction<Date>>;
	onOpenWorkout: (workout: Workout) => void;
	onDeleteWorkout: (workout: Workout) => void;
};

const dateKey = (date: Date) => date.toISOString().slice(0, 10);

export function HistoryPage({ workouts, totalSets, search, calendarOpen, calendarMonth, setSearch, setCalendarOpen, setCalendarMonth, onOpenWorkout, onDeleteWorkout }: HistoryPageProps) {
	const filteredWorkouts = useMemo(() => workouts.filter(workout => {
		const query = search.trim().toLowerCase();
		const workoutDate = String(workout.workout_date);
		const localizedDate = new Date(`${workoutDate}T00:00:00`).toLocaleDateString().toLowerCase();
		return workout.name.toLowerCase().includes(query) || workoutDate.includes(query) || localizedDate.includes(query);
	}), [workouts, search]);
	const workoutsByDate = useMemo(() => workouts.reduce<Record<string, Workout[]>>((grouped, workout) => {
		const key = String(workout.workout_date);
		grouped[key] = [...(grouped[key] ?? []), workout];
		return grouped;
	}, {}), [workouts]);
	const calendarDays = useMemo(() => {
		const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
		const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
		return [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index + 1))];
	}, [calendarMonth]);

	return <section className="tracker-page"><div className="page-title"><div><div className="section-label">Your log</div><h1>History</h1></div><div className="history-total">{workouts.length}<small>workouts</small></div></div><div className="history-stats"><div><small>WORKOUTS</small><strong>{workouts.length}</strong></div><div><small>SETS LOGGED</small><strong>{totalSets}</strong></div></div><div className="history-tools"><div className="search-box"><Search size={18} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search workouts..." /><button className="calendar-toggle" aria-label="Open workout calendar" aria-expanded={calendarOpen} onClick={() => setCalendarOpen(current => !current)}><CalendarDays size={19} /></button></div>{calendarOpen && <div className="calendar-popover"><div className="calendar-header"><button aria-label="Previous month" onClick={() => setCalendarMonth(current => new Date(current.getFullYear(), current.getMonth() - 1, 1))}><ChevronLeft size={18} /></button><strong>{calendarMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</strong><button aria-label="Next month" onClick={() => setCalendarMonth(current => new Date(current.getFullYear(), current.getMonth() + 1, 1))}><ChevronRight size={18} /></button></div><div className="calendar-weekdays">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{calendarDays.map((day, index) => { const key = day ? dateKey(day) : `empty-${index}`; const dayWorkouts = day ? workoutsByDate[key] ?? [] : []; return <button className={`calendar-day${dayWorkouts.length ? " has-workout" : ""}${search === key ? " selected" : ""}`} disabled={!day} key={key} onClick={() => { if (!day) return; setSearch(key); setCalendarOpen(false); }}><span>{day?.getDate() ?? ""}</span>{dayWorkouts.map(workout => <small key={workout.id}>{workout.name}</small>)}</button>; })}</div>{search && <button className="calendar-clear" onClick={() => setSearch("")}>Clear filter</button>}</div>}</div><div className="workout-list">{filteredWorkouts.length === 0 ? <div className="empty-card"><History size={28} /><h3>No matching workouts</h3></div> : filteredWorkouts.map(workout => <div className="history-card" key={workout.id}><button className="history-card-open" onClick={() => onOpenWorkout(workout)}><span><strong>{workout.name}</strong><small>{workout.workout_date}</small></span><ChevronRight size={20} /></button><button className="history-card-delete" aria-label={`Delete ${workout.name}`} onClick={() => onDeleteWorkout(workout)}><Trash2 size={18} /></button></div>)}</div></section>;
}
