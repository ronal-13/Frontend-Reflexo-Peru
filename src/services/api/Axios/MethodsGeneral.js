import instance from './baseConfig';
import { getLocalStorage } from '../../../utils/localStorageUtility';
import Appointments from '../../../mock/Appointments';
import Patients from '../../../mock/Patients';
import dayjs from 'dayjs';

const getMockPendingAppointments = () => {
  const today = dayjs().format('YYYY-MM-DD');
  // Ensure we have an array to work with
  const items = Appointments[0]?.items || [];
  return items.map((item, index) => ({
    ...item,
    appointment_date: today,
    appointment_hour: item.hour || (index % 2 === 0 ? '10:00:00' : '14:30:00'),
    full_name: `${item.paciente_name || ''} ${item.paciente_lastnamePaternal || ''} ${item.paciente_lastnameMaternal || ''}`.trim(),
    appointment_type: item.typeCita === 'C' ? 'Consulta' : 'Terapia',
  }));
};

export const get = async (url) => {
  const token = getLocalStorage('token');
  if (token === 'dummy_token_bypass') {
    // Mock for Home -> Today Appointments
    if (url.includes('appointments/calendar/pending')) {
      return { data: getMockPendingAppointments(), status: 200 };
    }
    
    // Mock for Appointments Table
    if (url.includes('appointments') && !url.includes('pending')) {
      // Modify dates to be recent
      const mockData = { ...Appointments[0] };
      if (mockData.items) {
         mockData.items = mockData.items.map(item => ({
             ...item,
             dateCita: dayjs().format('YYYY-MM-DD')
         }));
      }
      return { data: mockData, status: 200 };
    }

    // Mock for Patients Table
    if (url.includes('paciente') || url.includes('patients')) {
      return { data: Patients[0], status: 200 };
    }

    // Mock for Role
    if (url.includes('get-role')) {
      return { 
        data: { role_id: 1, name: 'Usuario Acceso Total', user_id: 1 }, 
        status: 200 
      };
    }
  }
  return instance.get(url);
};

export const post = (url, data) => instance.post(url, data);

export const put = (url, data) => instance.put(url, data);

export const del = (url) => instance.delete(url);

export const patch = (url, data) => instance.patch(url, data);

export const getID = (url, id) => instance.get(`${url}/${id}`);

export const putID = (url, id, data) => instance.put(`${url}/${id}`, data);

export const deleteID = (url, id) => instance.delete(`${url}/${id}`);

export const postID = (url, id, data) => instance.post(`${url}/${id}`, data);

export default {
  get,
  post,
  put,
  del,
  patch,
  getID,
  putID,
  deleteID,
  postID,
};
