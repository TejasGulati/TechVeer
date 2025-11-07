
const consultations = new Map();
const patients = new Map();
const rooms = new Map();

export const db = {
  saveConsultation: async (data) => {
    const id = `consult_${Date.now()}`;
    consultations.set(id, {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return id;
  },

  getConsultation: async (id) => {
    return consultations.get(id);
  },

  savePatient: async (data) => {
    const id = `patient_${Date.now()}`;
    patients.set(id, {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return id;
  },

  getPatient: async (id) => {
    return patients.get(id);
  },

  saveRoom: async (roomId, data) => {
    rooms.set(roomId, {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return roomId;
  },

  getRoom: async (roomId) => {
    return rooms.get(roomId);
  },
  getAllConsultations: async () => {
    return Array.from(consultations.values());
  },
};
