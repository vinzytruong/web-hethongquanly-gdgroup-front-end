import axios from "axios";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  ADD_CIRCULARS,
  DELETE_CIRCULARS,
  GET_ALL,
  UPDATE_CIRCULARS,
} from "@/store/circulars/action";
import { Circulars } from "@/interfaces/circulars";
import {
  addCircular,
  addListSubjects,
  deleteCircular,
  getCircular,
  updateCircular,
} from "@/constant/api";
let isCallAPI = false;
export default function useCirculars() {
  const dataCirculars = useAppSelector((state) => state.circulars);
  const [isLoadding, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isCallAPI === false) {
      getAllCirculars();
      isCallAPI = true;
    }
  }, []);

  const getAllCirculars = async () => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.get(getCircular, { headers });
      dispatch(GET_ALL({ circulars: response.data }));
      setIsLoading(false);
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const addCirculars = async (circulars: Circulars) => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.post(addCircular, circulars, { headers });
      getAllCirculars();
      setIsLoading(false);
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCirculars = async (circulars: Circulars) => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };
      //   const response = await axios.put(updateCircular, circulars, { headers });
      await axios.post(
        addListSubjects,
        {
          thongTuID: circulars.thongTuID,
          lstMonHoc: circulars.lstMonHoc?.map((x) => x.monHocID) || [],
        },
        {
          headers,
        }
      );
      getAllCirculars();
      // dispatch(UPDATE_CIRCULARS({ circulars: dataCirculars, id: response.data.nhaThauID }))
      setIsLoading(false);
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCirculars = async (id: number) => {
    try {
      await axios.delete(deleteCircular, { params: { id } });
      dispatch(DELETE_CIRCULARS({ id }));
      setIsLoading(false);
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoadding,
    dataCirculars,
    getAllCirculars,
    addCirculars,
    updateCirculars,
    deleteCirculars,
  };
}
