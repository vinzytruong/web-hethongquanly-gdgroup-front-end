import axios from "axios";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  ADD_GRADES,
  DELETE_GRADES,
  GET_ALL,
  UPDATE_GRADES,
} from "@/store/grades/action";
import { Grades } from "@/interfaces/grades";
import { addGrade, deleteGrade, getGrade, updateGrade } from "@/constant/api";

export default function useGrades() {
  const dataGrades = useAppSelector((state) => state.grades);
  const [isLoadding, setIsLoading] = useState(true);
  const [getAll, setGelAll] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (dataGrades.length === 0 && getAll === false) {
      getAllGrades();
      setGelAll(true);
    }
  }, []);

  const getAllGrades = async () => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.get(getGrade, { headers });
      dispatch(GET_ALL({ grades: response.data }));
      setIsLoading(false);
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const addGrades = async (grades: Grades) => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.post(addGrade, grades, { headers });
      dispatch(ADD_GRADES({ grades: response.data }));
      setIsLoading(false);
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGrades = async (grades: Grades) => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.put(updateGrade, grades, { headers });
      console.log("updatedItems_hook", response.data);
      getAllGrades();
      // dispatch(UPDATE_GRADES({ grades: dataGrades, id: response.data.nhaThauID }))
      setIsLoading(false);
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGrades = async (id: number) => {
    try {
      await axios.delete(deleteGrade, { params: { id } });
      dispatch(DELETE_GRADES({ id }));
      setIsLoading(false);
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoadding,
    dataGrades,
    getAllGrades,
    addGrades,
    updateGrades,
    deleteGrades,
  };
}
