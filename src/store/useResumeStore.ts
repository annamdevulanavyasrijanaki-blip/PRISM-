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
  addPage: () => void;
  removePage: (index: number) => void;
  moveSection: (sectionId: string, toPageIndex: number, toIndex: number) => void;
  setPages: (pages: string[][]) => void;
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
        
        // Also update pages
        const pages = state.data.pages || [order];
        let newPages = pages.map(p => p.filter(id => id !== sectionId));
        if (!order.includes(sectionId)) {
          // If adding, add to the last page by default
          newPages[newPages.length - 1].push(sectionId);
        }
        
        return { 
          data: { 
            ...state.data, 
            sectionOrder: newOrder,
            pages: newPages
          } 
        };
      }),
      addPage: () => set((state) => ({
        data: {
          ...state.data,
          pages: [...(state.data.pages || [state.data.sectionOrder]), []]
        }
      })),
      removePage: (index) => set((state) => {
        const pages = [...(state.data.pages || [state.data.sectionOrder])];
        if (pages.length <= 1) return state;
        
        const sectionsToMove = pages[index];
        const newPages = pages.filter((_, i) => i !== index);
        // Move sections from deleted page to the previous page (or next if index 0)
        const targetIndex = index === 0 ? 0 : index - 1;
        newPages[targetIndex] = [...newPages[targetIndex], ...sectionsToMove];
        
        return {
          data: { ...state.data, pages: newPages }
        };
      }),
      moveSection: (sectionId, toPageIndex, toIndex) => set((state) => {
        const pages = (state.data.pages || [state.data.sectionOrder]).map(p => [...p]);
        // Remove from current position
        const newPages = pages.map(p => p.filter(id => id !== sectionId));
        // Add to new position
        newPages[toPageIndex].splice(toIndex, 0, sectionId);
        
        // Update sectionOrder as a flat version for compatibility
        const newOrder = newPages.flat();
        
        return {
          data: {
            ...state.data,
            pages: newPages,
            sectionOrder: newOrder
          }
        };
      }),
      setPages: (pages) => set((state) => ({
        data: {
          ...state.data,
          pages,
          sectionOrder: pages.flat()
        }
      })),
      removeSectionCompletely: (sectionId) => set((state) => ({
        data: {
          ...state.data,
          sectionOrder: state.data.sectionOrder.filter(id => id !== sectionId),
          pages: (state.data.pages || [state.data.sectionOrder]).map(p => p.filter(id => id !== sectionId))
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
      name: 'resume-forge-storage-v5', // Updated name to force reset of hardcoded data
    }
  )
);
