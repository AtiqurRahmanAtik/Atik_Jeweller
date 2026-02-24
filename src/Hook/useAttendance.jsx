// Hook/useAttendance.js
import { useState, useCallback } from 'react';
import UseAxiosSecure from './UseAxioSecure';

export const useAttendance = () => {
  const axiosSecure = UseAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPaginatedAttendances = useCallback(async (params) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get('/attendance/paginate', { params });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const getMyAttendanceHistory = useCallback(async (employeeId, date) => {
    setLoading(true);
    try {
      // date format should be "YYYY-MM"
      const { data } = await axiosSecure.get(`/attendance/my-history/${employeeId}?date=${date}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const createAttendance = async (data) => {
    setLoading(true);
    try {
      const res = await axiosSecure.post('/attendance/post', data);
      return res.data;
    } catch (err) { throw err; } finally { setLoading(false); }
  };

  const getAttendanceReport = useCallback(async (params) => {
    setLoading(true);
    try {
      // params should contain { month, year, department, employee }
      const { data } = await axiosSecure.get('/attendance/report', { params });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const updateAttendance = async (id, data) => {
    setLoading(true);
    try {
      const res = await axiosSecure.put(`/attendance/update/${id}`, data);
      return res.data;
    } catch (err) { throw err; } finally { setLoading(false); }
  };

  const removeAttendance = async (id) => {
    setLoading(true);
    try {
      await axiosSecure.delete(`/attendance/delete/${id}`);
    } catch (err) { throw err; } finally { setLoading(false); }
  };

  const bulkCreateAttendance = async (attendanceArray) => {
    setLoading(true);
    try {
      const res = await axiosSecure.post('/attendance/bulk', attendanceArray);
      return res.data;
    } catch (err) { throw err; } finally { setLoading(false); }
  };

  return {
    loading,
    error,
    getPaginatedAttendances,
    createAttendance,
    updateAttendance,
    getMyAttendanceHistory,
    removeAttendance,
    getAttendanceReport,
    bulkCreateAttendance
  };
};