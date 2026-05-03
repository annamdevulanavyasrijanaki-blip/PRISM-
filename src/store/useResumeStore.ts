import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData, INITIAL_RESUME_DATA, EMPTY_RESUME_DATA } from '../types';

interface ResumeState {
  data: ResumeData;
  setData: (data: ResumeData) => void;
  updatePersonal: (field: string, value: string) => void;
  setSectionOrder: (order: string[]) => void;
  toggleSection: (sectionId: string) => void;
  sidebarOpen: boolean;
  toggleSidebar: (open?: boolean) => void;
  formOpen: boolean;
  toggleForm: (open?: boolean) => void;
  resetData: (empty?: boolean) => void;
  removeSectionCompletely: (sectionId: string) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      data: INITIAL_RESUME_DATA,
      sidebarOpen: true,
      formOpen: true,
      setData: (data) => set({ data }),
      updatePersonal: (field, value) => set((state) => ({
        data: {
          ...state.data,
          personal: {
            ...state.data.personal,
            [field]: value
          }
        }
      })),
      setSectionOrder: (order) => set((state) => ({
        data: { ...state.data, sectionOrder: order }
      })),
      toggleSection: (sectionId) => set((state) => {
        const order = state.data.sectionOrder;
        const newOrder = order.includes(sectionId)
          ? order.filter(id => id !== sectionId)
          : [...order, sectionId];
        return { data: { ...state.data, sectionOrder: newOrder } };
      }),
      removeSectionCompletely: (sectionId) => set((state) => ({
        data: {
          ...state.data,
          sectionOrder: state.data.sectionOrder.filter(id => id !== sectionId)
        }
      })),
      toggleSidebar: (open) => set((state) => ({ 
        sidebarOpen: typeof open === 'boolean' ? open : !state.sidebarOpen 
      })),
      toggleForm: (open) => set((state) => ({ 
        formOpen: typeof open === 'boolean' ? open : !state.formOpen 
      })),
      resetData: (empty) => set({ data: empty ? EMPTY_RESUME_DATA : INITIAL_RESUME_DATA }),
    }),
    {
      name: 'resume-storage', // name of the item in storage (must be unique)
    }
  )
);
