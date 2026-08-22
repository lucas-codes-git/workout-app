import { CalendarDays, Check, Dumbbell, FileText, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Exercise } from "../types/exercise";
import type { Workout } from "../types/workout";
import type { WorkoutExercise } from "../types/workoutExercise";
import type { WorkoutSet } from "../types/set";

type Draft = { weight: string; reps: string; rir: string };

type TodayPageProps = {
  activeWorkout: Workout | null;
  workoutType: string;
  customName: string;
  setWorkoutType: Dispatch<SetStateAction<string>>;
  workoutExercises: WorkoutExercise[];
  exercises: Exercise[];
  sets: Record<string, WorkoutSet[]>;
  selectedExercise: string;
  newExerciseName: string;
  draft: Draft;
  setCustomName: Dispatch<SetStateAction<string>>;
  setSelectedExercise: Dispatch<SetStateAction<string>>;
  setNewExerciseName: Dispatch<SetStateAction<string>>;
  setDraft: Dispatch<SetStateAction<Draft>>;
  onStartWorkout: () => void;
  onAttachExercise: () => void;
  onMakeExercise: () => void;
  onLogSet: (workoutExerciseId: string) => void;
  onDeleteSet: (setId: string, workoutExerciseId: string) => void;
  onSaveNotes: (notes: string) => void;
};

export function TodayPage({ activeWorkout, workoutType, customName, setWorkoutType, workoutExercises, exercises, sets, selectedExercise, newExerciseName, draft, setCustomName, setSelectedExercise, setNewExerciseName, setDraft, onStartWorkout, onAttachExercise, onMakeExercise, onLogSet, onDeleteSet, onSaveNotes }: TodayPageProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const totalSets = Object.values(sets).reduce((total, exerciseSets) => total + exerciseSets.length, 0);
  const exerciseName = (id: string) => exercises.find(exercise => exercise.id === id)?.name ?? "Exercise";
  useEffect(() => { setNotes(activeWorkout?.notes ?? ""); setNotesOpen(false); }, [activeWorkout]);

  return <section className="tracker-page">
    <div className="date-line"><span><CalendarDays size={20} /> {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</span><time>{activeWorkout?.workout_date ?? new Date().toISOString().slice(0, 10)}</time></div>
    {!activeWorkout && <><div className="section-label">Workout type</div><div className="type-scroller">{["Push", "Pull", "Upper", "Lower", "Legs", "Full Body", "Core", "Cardio", "Other"].map(type => <button className={workoutType === type ? "chosen" : ""} key={type} onClick={() => setWorkoutType(type)}>{type}</button>)}</div></>}
    {!activeWorkout ? <section className="start-card">
      <Dumbbell size={34} /><h2>Ready to train?</h2><p>Choose a focus, name your session, and start logging.</p>
      {workoutType === "Other" && <input autoFocus value={customName} onChange={event => setCustomName(event.target.value)} placeholder="Name your workout" />}
      <button className="green-action" disabled={workoutType === "Other" && !customName.trim()} onClick={onStartWorkout}>Start {workoutType === "Other" ? customName.trim() || "workout" : workoutType}</button>
    </section> : <>
      <div className="summary-card"><div><small>EXERCISES</small><strong>{workoutExercises.length}</strong></div><div><small>SETS DONE</small><strong className="green-text">{totalSets}</strong></div></div>
      <div className="section-heading"><span>Exercises <small>({workoutExercises.length})</small></span><button className="notes-link" onClick={() => setNotesOpen(true)}><FileText size={15} /> {activeWorkout.notes ? "Edit notes" : "Workout notes"}</button></div>
      {notesOpen && <div className="modal-backdrop" onClick={() => setNotesOpen(false)}><section className="notes-modal" onClick={event => event.stopPropagation()}><div className="notes-modal-header"><h2>Workout notes</h2><button aria-label="Close notes" onClick={() => setNotesOpen(false)}><X size={19} /></button></div><textarea value={notes} onChange={event => setNotes(event.target.value)} placeholder="Add notes about this workout..." autoFocus /><div className="notes-modal-actions"><button className="text-button" onClick={() => setNotesOpen(false)}>Cancel</button><button className="green-action" onClick={() => { onSaveNotes(notes); setNotesOpen(false); }}>Save notes</button></div></section></div>}
      <div className="exercise-picker"><select value={selectedExercise} onChange={event => setSelectedExercise(event.target.value)}><option value="">Choose an exercise...</option>{exercises.filter(exercise => !workoutExercises.some(item => item.exercise_id === exercise.id)).map(exercise => <option key={exercise.id} value={exercise.id}>{exercise.name}</option>)}</select><button className="round-icon" onClick={onAttachExercise}><Plus size={19} /></button></div>
      <div className="new-exercise"><input value={newExerciseName} onChange={event => setNewExerciseName(event.target.value)} placeholder="New exercise name" /><button className="text-button" onClick={onMakeExercise}><Check size={16} /> Create</button></div>
      {workoutExercises.length === 0 ? <div className="empty-card"><Dumbbell size={30} /><h3>No exercises added yet</h3><p>Choose an exercise above to start your {activeWorkout.name} workout.</p></div> : <div className="exercise-list">{workoutExercises.map(item => <article className="exercise-card" key={item.id}>
        <div className="exercise-card-head"><div><span className="exercise-index">{String(item.exercise_order).padStart(2, "0")}</span><h3>{exerciseName(item.exercise_id)}</h3></div><span>{sets[item.id]?.length ?? 0} sets</span></div>
        {sets[item.id]?.map(set => <div className="logged-set" key={set.id}><span>#{set.set_number}</span><strong>{set.weight} lbs × {set.reps}</strong><small>RIR {set.rir}</small><button onClick={() => onDeleteSet(set.id, item.id)}><Trash2 size={15} /></button></div>)}
        <div className="set-form"><input type="number" min="0" placeholder="lbs" value={draft.weight} onChange={event => setDraft({ ...draft, weight: event.target.value })} /><input type="number" min="1" placeholder="Reps" value={draft.reps} onChange={event => setDraft({ ...draft, reps: event.target.value })} /><input type="number" min="0" max="10" placeholder="RIR" value={draft.rir} onChange={event => setDraft({ ...draft, rir: event.target.value })} /><button className="log-button" onClick={() => onLogSet(item.id)}><Plus size={17} /> Log set</button></div>
      </article>)}</div>}
    </>}
  </section>;
}
