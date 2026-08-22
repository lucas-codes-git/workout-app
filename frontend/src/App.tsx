import { useEffect, useState } from "react";
import { Activity, CalendarDays, Dumbbell, History } from "lucide-react";
import { createExercise, getExercises } from "./api/exercises";
import { createSet, deleteSet, getSets } from "./api/sets";
import { addExerciseToWorkout, getWorkoutExercises } from "./api/workoutExercises";
import { createWorkout, deleteWorkout, getWorkouts, updateWorkout } from "./api/workout";
import { HistoryPage } from "./pages/history";
import { TodayPage } from "./pages/today";
import type { Exercise } from "./types/exercise";
import type { Workout } from "./types/workout";
import type { WorkoutExercise } from "./types/workoutExercise";
import type { WorkoutSet } from "./types/set";

type Tab = "today" | "history";

type Draft = { weight: string; reps: string; rir: string };

function App() {
  const [tab, setTab] = useState<Tab>("today");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [sets, setSets] = useState<Record<string, WorkoutSet[]>>({});
  const [workoutType, setWorkoutType] = useState("Push");
  const [customName, setCustomName] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [newExerciseName, setNewExerciseName] = useState("");
  const [draft, setDraft] = useState<Draft>({ weight: "", reps: "", rir: "2" });
  const [search, setSearch] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [error, setError] = useState("");

  const loadWorkouts = async () => {
    try { setWorkouts(await getWorkouts()); setError(""); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not reach the API."); }
  };
  useEffect(() => { void loadWorkouts(); }, []);
  useEffect(() => {
    if (!activeWorkout) return;
    void Promise.all([getExercises(), getWorkoutExercises(activeWorkout.id)]).then(async ([allExercises, attached]) => {
      setExercises(allExercises);
      setWorkoutExercises(attached.sort((first, second) => first.exercise_order - second.exercise_order));
      const loaded = await Promise.all(attached.map(async item => [item.id, await getSets(item.id)] as const));
      setSets(Object.fromEntries(loaded));
    }).catch(caught => setError(caught instanceof Error ? caught.message : "Could not load workout."));
  }, [activeWorkout]);

  const totalSets = Object.values(sets).reduce((total, exerciseSets) => total + exerciseSets.length, 0);
  const startWorkout = async () => {
    const workout = await createWorkout({ name: workoutType === "Other" ? customName.trim() : workoutType, workout_date: new Date().toISOString().slice(0, 10) });
    setCustomName(""); setActiveWorkout(workout); setTab("today"); await loadWorkouts();
  };
  const attachExercise = async () => {
    if (!activeWorkout || !selectedExercise) return;
    const attached = await addExerciseToWorkout(activeWorkout.id, selectedExercise, workoutExercises.length + 1);
    setWorkoutExercises(current => [...current, attached]); setSets(current => ({ ...current, [attached.id]: [] })); setSelectedExercise("");
  };
  const makeExercise = async () => {
    if (!activeWorkout || !newExerciseName.trim()) return;
    const exercise = await createExercise(newExerciseName.trim());
    const attached = await addExerciseToWorkout(activeWorkout.id, exercise.id, workoutExercises.length + 1);
    setExercises(current => [...current, exercise]); setWorkoutExercises(current => [...current, attached]); setSets(current => ({ ...current, [attached.id]: [] })); setNewExerciseName("");
  };
  const logSet = async (workoutExerciseId: string) => {
    if (!draft.weight || !draft.reps) return;
    const logged = await createSet(workoutExerciseId, { weight: Number(draft.weight), reps: Number(draft.reps), rir: Number(draft.rir) });
    setSets(current => ({ ...current, [workoutExerciseId]: [...(current[workoutExerciseId] ?? []), logged] }));
    setDraft(current => ({ ...current, weight: "", reps: "" }));
  };
  const handleDeleteSet = async (setId: string, workoutExerciseId: string) => {
    await deleteSet(setId);
    setSets(current => ({ ...current, [workoutExerciseId]: current[workoutExerciseId].filter(existing => existing.id !== setId) }));
  };
  const removeWorkout = async (workout: Workout) => {
    if (!window.confirm(`Delete ${workout.name}? This will also delete its exercises and sets.`)) return;
    try {
      await deleteWorkout(workout.id);
      setWorkouts(current => current.filter(existing => existing.id !== workout.id));
      setActiveWorkout(current => current?.id === workout.id ? null : current);
      setError("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not delete workout."); }
  };
  const saveNotes = async (notes: string) => {
    if (!activeWorkout) return;
    try {
      const updated = await updateWorkout(activeWorkout.id, { name: activeWorkout.name, workout_date: activeWorkout.workout_date, notes: notes.trim() || null });
      setActiveWorkout(updated);
      setWorkouts(current => current.map(workout => workout.id === updated.id ? updated : workout));
      setError("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save workout notes."); }
  };

  return <div className="tracker-shell">
    <header className="app-header"><div className="app-brand"><span className="app-logo"><Dumbbell size={22} /></span><span><strong>Workout Tracker</strong></span></div><div className="header-actions"><span className="unit-badge"><Activity size={17} /> LBS</span></div></header>
    <main className="tracker-content">
      <nav className="tab-switcher"><button className={tab === "today" ? "selected" : ""} onClick={() => setTab("today")}><CalendarDays size={18} /> Today</button><button className={tab === "history" ? "selected" : ""} onClick={() => setTab("history")}><History size={18} /> History <span className="tab-count">{workouts.length}</span></button></nav>
      {error && <div className="error-banner">{error}</div>}
      {tab === "today" && <TodayPage activeWorkout={activeWorkout} workoutType={workoutType} customName={customName} setWorkoutType={setWorkoutType} workoutExercises={workoutExercises} exercises={exercises} sets={sets} selectedExercise={selectedExercise} newExerciseName={newExerciseName} draft={draft} setCustomName={setCustomName} setSelectedExercise={setSelectedExercise} setNewExerciseName={setNewExerciseName} setDraft={setDraft} onStartWorkout={() => void startWorkout()} onAttachExercise={() => void attachExercise()} onMakeExercise={() => void makeExercise()} onLogSet={workoutExerciseId => void logSet(workoutExerciseId)} onDeleteSet={(setId, workoutExerciseId) => void handleDeleteSet(setId, workoutExerciseId)} onSaveNotes={notes => void saveNotes(notes)} />}
      {tab === "history" && <HistoryPage workouts={workouts} totalSets={totalSets} search={search} calendarOpen={calendarOpen} calendarMonth={calendarMonth} setSearch={setSearch} setCalendarOpen={setCalendarOpen} setCalendarMonth={setCalendarMonth} onOpenWorkout={workout => { setActiveWorkout(workout); setTab("today"); }} onDeleteWorkout={workout => void removeWorkout(workout)} />}
    </main>
  </div>;
}

export default App;
