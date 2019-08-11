import React from "react";
import ExerciseTemplate from "../exercises/exercises";
import exerciseData from "./exercises.json";

const Exercises = () => {
	return <ExerciseTemplate
		data={exerciseData.exercises}
	/>;
};

export default Exercises;
