import { useState, useCallback } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const API = `${process.env.REACT_APP_BACKEND_URL}/metaltype`;

export const useMetalTypes = () => {

  const { branch } = useAuth();

  const [metalTypes, setMetalTypes] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);


  console.log("metalTypes :", metalTypes);
  

  // GET
  const fetchMetalTypes = useCallback(async (page = 1, limit = 10) => {

    try {

      setLoading(true);

      const res = await axios.get(`${API}/${branch}/get-all?page=${page}&limit=${limit}`);

      setMetalTypes(res.data.data);
      setPagination(res.data.pagination);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  }, [branch]);


  // CREATE
 const createMetalType = async (metalName) => {

  try {

    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/metaltype/post`,
      {
        ...metalName,
        branch
      }
    );

    return res.data;

  } catch (err) {

    console.log(err.response?.data);

  }

};


  // UPDATE
  const updateMetalType = async (id, metalName) => {

    try {

      setLoading(true);

      await axios.put(`${API}/update/${id}`, {
        ...metalName,
        branch
      });

      return true;

    } catch (err) {

      console.log(err);

      return false;

    } finally {

      setLoading(false);

    }

  };


  // DELETE
  const deleteMetalType = async (id) => {

    try {

      setLoading(true);

      await axios.delete(`${API}/delete/${id}`);

      return true;

    } catch (err) {

      console.log(err);

      return false;

    } finally {

      setLoading(false);

    }

  };

  return {
    metalTypes,
    pagination,
    loading,
    fetchMetalTypes,
    createMetalType,
    updateMetalType,
    deleteMetalType
  };

};