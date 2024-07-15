import axios from "axios";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  ADD_SUBJECTS,
  DELETE_SUBJECTS,
  GET_ALL,
  UPDATE_SUBJECTS,
} from "@/store/subjects/action";
import { Subjects } from "@/interfaces/subjects";
import {
  addSubject,
  deleteSubject,
  getSubject,
  updateSubject,
} from "@/constant/api";

export default function useSubjects() {
  const dataSubjects = useAppSelector((state) => state.subjects);
  const [isLoadding, setIsLoading] = useState(true);
  const [getAll, setGetAll] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (dataSubjects.length === 0 && getAll === false) {
      getAllSubjects();
      setGetAll(true);
    }
  }, [dataSubjects]);

  const getAllSubjects = async () => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.get(getSubject, { headers });
      console.log("call API", response.data);

      dispatch(GET_ALL({ subjects: response.data }));
      setIsLoading(false);
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const addSubjects = async (subjects: Subjects) => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.post(addSubject, subjects, { headers });
      dispatch(ADD_SUBJECTS({ subjects: response.data }));
      setIsLoading(false);
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubjects = async (subjects: Subjects) => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.put(updateSubject, subjects, { headers });
      getAllSubjects();
      // dispatch(UPDATE_SUBJECTS({ subjects: dataSubjects, id: response.data.nhaThauID }))
      setIsLoading(false);
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSubjects = async (id: number) => {
    try {
      await axios.delete(deleteSubject, { params: { id } });
      dispatch(DELETE_SUBJECTS({ id }));
      setIsLoading(false);
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoadding,
    dataSubjects,
    getAllSubjects,
    addSubjects,
    updateSubjects,
    deleteSubjects,
  };
}
