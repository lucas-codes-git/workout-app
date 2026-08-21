import { useEffect, useMemo, useState } from "react";
import { Activity, CalendarDays, Check, ChevronRight, Dumbbell, History, Plus, Search, Trash2 } from "lucide-react";
import { createExercise, getExercises } from "./api/exercises";
import { addExerciseToWorkout, getWorkoutExercises } from "./api/workoutExercises";
import { createSet, deleteSet, getSets } from "./api/sets";
import { createWorkout, getWorkouts } from "./api/workout";
import type { Exercise } from "./types/exercise";
import type { WorkoutExercise } from "./types/workoutExercise";
import type { WorkoutSet } from "./types/set";
import type { Workout } from "./types/workout";

type Tab = "today" | "history";
const workoutTypes = ["Push", "Pull", "Upper", "Lower", "Legs", "Full Body", "Core", "Cardio", "Other"];

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
  const [draft, setDraft] = useState({ weight: "", reps: "", rir: "2" });
  const [search, setSearch] = useState("");
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
  const totalVolume = Object.values(sets).flat().reduce((total, set) => total + Number(set.weight) * set.reps, 0);
  const filteredWorkouts = useMemo(() => workouts.filter(workout => workout.name.toLowerCase().includes(search.toLowerCase())), [workouts, search]);
  const exerciseName = (id: string) => exercises.find(exercise => exercise.id === id)?.name ?? "Exercise";

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

  return (
    <div className="tracker-shell">
      <header className="app-header">
        <div className="app-brand"><span className="app-logo"><Dumbbell size={22} /></span><span><strong>Workout Tracker</strong></span></div>
        <div className="header-actions"><span className="unit-badge"><Activity size={17} /> LBS</span></div>
      </header>
      <main className="tracker-content">
        <nav className="tab-switcher"><button className={tab === "today" ? "selected" : ""} onClick={() => setTab("today")}><CalendarDays size={18} /> Today</button><button className={tab === "history" ? "selected" : ""} onClick={() => setTab("history")}><History size={18} /> History <span className="tab-count">{workouts.length}</span></button></nav>
        {error && <div className="error-banner">{error}</div>}
        {tab === "today" && <section className="tracker-page">
          <div className="date-line"><span><CalendarDays size={20} /> {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</span><time>{activeWorkout?.workout_date ?? new Date().toISOString().slice(0, 10)}</time></div>
          {!activeWorkout && <><div className="section-label">Workout type</div><div className="type-scroller">{workoutTypes.map(type => <button className={workoutType === type ? "chosen" : ""} key={type} onClick={() => setWorkoutType(type)}>{type}</button>)}</div></>}
          {!activeWorkout ? <section className="start-card">
            <Dumbbell size={34} /><h2>Ready to train?</h2><p>Choose a focus, name your session, and start logging.</p>
            {workoutType === "Other" && <input autoFocus value={customName} onChange={event => setCustomName(event.target.value)} placeholder="Name your workout" />}
            <button className="green-action" disabled={workoutType === "Other" && !customName.trim()} onClick={() => void startWorkout()}>Start {workoutType === "Other" ? customName.trim() || "workout" : workoutType}</button>
          </section> : <>
            <div className="summary-card"><div><small>EXERCISES</small><strong>{workoutExercises.length}</strong></div><div><small>SETS DONE</small><strong className="green-text">{totalSets}</strong></div><div><small>VOLUME (LBS)</small><strong className="blue-text">{totalVolume.toLocaleString()}</strong></div></div>
            <div className="section-heading"><span>Exercises <small>({workoutExercises.length})</small></span><span className="notes-link">Workout notes</span></div>
            <div className="exercise-picker"><select value={selectedExercise} onChange={event => setSelectedExercise(event.target.value)}><option value="">Choose an exercise...</option>{exercises.filter(exercise => !workoutExercises.some(item => item.exercise_id === exercise.id)).map(exercise => <option key={exercise.id} value={exercise.id}>{exercise.name}</option>)}</select><button className="round-icon" onClick={() => void attachExercise()}><Plus size={19} /></button></div>
            <div className="new-exercise"><input value={newExerciseName} onChange={event => setNewExerciseName(event.target.value)} placeholder="New exercise name" /><button className="text-button" onClick={() => void makeExercise()}><Check size={16} /> Create</button></div>
            {workoutExercises.length === 0 ? <div className="empty-card"><Dumbbell size={30} /><h3>No exercises added yet</h3><p>Choose an exercise above to start your {activeWorkout.name} workout.</p></div> : <div className="exercise-list">{workoutExercises.map(item => <article className="exercise-card" key={item.id}>
              <div className="exercise-card-head"><div><span className="exercise-index">{String(item.exercise_order).padStart(2, "0")}</span><h3>{exerciseName(item.exercise_id)}</h3></div><span>{sets[item.id]?.length ?? 0} sets</span></div>
              {sets[item.id]?.map(set => <div className="logged-set" key={set.id}><span>#{set.set_number}</span><strong>{set.weight} lbs × {set.reps}</strong><small>RIR {set.rir}</small><button onClick={() => void deleteSet(set.id).then(() => setSets(current => ({ ...current, [item.id]: current[item.id].filter(existing => existing.id !== set.id) })))}><Trash2 size={15} /></button></div>)}
              <div className="set-form"><input type="number" min="0" placeholder="lbs" value={draft.weight} onChange={event => setDraft({ ...draft, weight: event.target.value })} /><input type="number" min="1" placeholder="Reps" value={draft.reps} onChange={event => setDraft({ ...draft, reps: event.target.value })} /><input type="number" min="0" max="10" placeholder="RIR" value={draft.rir} onChange={event => setDraft({ ...draft, rir: event.target.value })} /><button className="log-button" onClick={() => void logSet(item.id)}><Plus size={17} /> Log set</button></div>
            </article>)}</div>}
          </>}
        </section>}
        {tab === "history" && <section className="tracker-page"><div className="page-title"><div><div className="section-label">Your log</div><h1>History</h1></div><div className="history-total">{workouts.length}<small>workouts</small></div></div><div className="history-stats"><div><small>WORKOUTS</small><strong>{workouts.length}</strong></div><div><small>SETS LOGGED</small><strong>{totalSets}</strong></div><div><small>VOLUME</small><strong>{totalVolume.toLocaleString()}</strong></div></div><div className="search-box"><Search size={18} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search workouts..." /></div><div className="workout-list">{filteredWorkouts.length === 0 ? <div className="empty-card"><History size={28} /><h3>No matching workouts</h3></div> : filteredWorkouts.map(workout => <button className="history-card" key={workout.id} onClick={() => { setActiveWorkout(workout); setTab("today"); }}><span><strong>{workout.name}</strong><small>{workout.workout_date}</small></span><ChevronRight size={20} /></button>)}</div></section>}
      </main>
    </div>
  );
}

export default App;
