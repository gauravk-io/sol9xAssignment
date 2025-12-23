import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Users, UserPlus, Edit, Trash2, Search,
  X, Save, Loader2, CheckCircle2,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    name: '', email: '', course: '', password: ''
  });
  const [notification, setNotification] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/');
      setStudents(data);
    } catch (error) {
      showNotice('Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/${id}`);
        setStudents(students.filter(s => s._id !== id));
        showNotice('Student deleted successfully');
      } catch (error) {
        showNotice('Delete failed', 'error');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { data: updatedStudent } = await api.put(`/${currentStudent._id}`, currentStudent);
        setStudents(prevStudents =>
          prevStudents.map(s => String(s._id) === String(updatedStudent._id) ? updatedStudent : s)
        );
        showNotice('Student updated successfully');
      } else {
        const { data: newStudent } = await api.post('/', currentStudent);
        setStudents(prevStudents => [...prevStudents, newStudent]);
        showNotice('Student added successfully');
      }
      setIsModalOpen(false);
      // Stay on current page for updates
    } catch (error) {
      showNotice(error.response?.data?.message || 'Action failed', 'error');
    }
  };

  const openAddModal = () => {
    setCurrentStudent({ name: '', email: '', course: '', password: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setCurrentStudent(student);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-4">

        {/* Left Sidebar */}
        <div
          className="h-[calc(100vh-160px)] md:col-span-1"
        >
          <div className="h-full space-y-8 overflow-y-auto rounded-xl border border-white/5 bg-white/[0.015] p-8 backdrop-blur-[20px]">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
                <Users className="text-white" /> Admin
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-white">Administrative Management</p>
            </div>

            <button onClick={openAddModal} className="flex h-14 w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 text-base font-bold text-white shadow-lg transition-all hover:bg-white/10 hover:border-white/40 active:scale-95">
              <UserPlus size={20} /> New Student
            </button>

            <div className="space-y-4 border-t border-zinc-800 pt-4">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white">Quick Stats</p>
                <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-4">
                  <p className="text-xs font-medium text-white">Total Registered Students</p>
                  <p className="mt-1 text-2xl font-bold text-white">{students.length}</p>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white">Filter Records</p>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="h-11 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 pl-11 text-sm text-white transition-all placeholder:text-white/50 focus:border-zinc-400 focus:bg-zinc-950/50 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div
          className="flex h-[calc(100vh-160px)] flex-col md:col-span-3"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/5 bg-white/[0.015] backdrop-blur-[20px]">
            {loading ? (
              <div className="flex flex-1 flex-col items-center justify-center p-32">
                <Loader2 className="mb-4 animate-spin text-white" size={40} />
                <p className="font-medium text-white">Fetching records...</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="sticky top-0 z-10 bg-zinc-900/50 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">
                          <th className="border-b border-zinc-800/50 px-8 py-5">Student Identity</th>
                          <th className="border-b border-zinc-800/50 px-8 py-5">Program</th>
                          <th className="border-b border-zinc-800/50 px-8 py-5">Registry Date</th>
                          <th className="border-b border-zinc-800/50 px-8 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {currentStudents.length > 0 ? currentStudents.map((student) => (
                          <tr key={student._id} className="group transition-all hover:bg-white/[0.02]">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 font-bold text-white transition-transform group-hover:scale-105">
                                  {student.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold tracking-tight text-white">{student.name}</p>
                                  <p className="text-xs font-medium text-white">{student.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="inline-flex shrink-0 items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                                {student.course}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-sm font-medium text-white">
                              {new Date(student.enrollmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex justify-end gap-3 transition-opacity">
                                <button
                                  onClick={() => openEditModal(student)}
                                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-white transition-all hover:bg-zinc-700 hover:text-white"
                                  title="Edit Record"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(student._id)}
                                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-white transition-all hover:bg-zinc-700 hover:text-white"
                                  title="Delete Record"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="4" className="px-8 py-32 text-center">
                              <div className="flex flex-col items-center opacity-40">
                                <Users size={48} className="mb-4 text-white" />
                                <p className="font-medium text-white">No records found matching criteria.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex shrink-0 items-center justify-between border-t border-zinc-800/50 bg-zinc-900/10 p-6">
                  <p className="text-xs font-medium italic text-white">
                    Showing <span className="font-bold text-white">{indexOfFirstStudent + 1}</span> to <span className="font-bold text-white">{Math.min(indexOfLastStudent, filteredStudents.length)}</span> of <span className="font-bold text-white">{filteredStudents.length}</span> students
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 text-white transition-all hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="mx-2 flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => paginate(i + 1)}
                          className={`h-10 w-10 rounded-xl border text-xs font-bold transition-all ${
                            currentPage === i + 1
                              ? 'bg-white/20 border-white text-white shadow-lg'
                              : 'border-white/10 text-white hover:bg-white/5 hover:border-white/30'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 text-white transition-all hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <div
              className="relative z-10 w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {isEditing ? 'Edit Student Details' : 'Add New Student'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-white">
                  <X />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="ml-1 text-sm font-medium text-white">Full Name</label>
                  <input
                    type="text"
                    value={currentStudent.name}
                    onChange={(e) => setCurrentStudent({...currentStudent, name: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white focus:border-zinc-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="ml-1 text-sm font-medium text-white">Email Address</label>
                  <input
                    type="email"
                    value={currentStudent.email}
                    onChange={(e) => setCurrentStudent({...currentStudent, email: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white focus:border-zinc-400 focus:outline-none"
                    required
                  />
                </div>
                {!isEditing && (
                  <div>
                    <label className="ml-1 text-sm font-medium text-white">Password</label>
                    <input
                      type="password"
                      value={currentStudent.password}
                      onChange={(e) => setCurrentStudent({...currentStudent, password: e.target.value})}
                      className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white focus:border-zinc-400 focus:outline-none"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="ml-1 text-sm font-medium text-white">Course Name</label>
                  <input
                    type="text"
                    value={currentStudent.course}
                    onChange={(e) => setCurrentStudent({...currentStudent, course: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white focus:border-zinc-400 focus:outline-none"
                    required
                  />
                </div>
                <div className="mt-8 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-medium text-white transition-all hover:bg-white/10 hover:border-white/30">
                    Cancel
                  </button>
                  <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3 font-medium text-white transition-all hover:bg-white/20 hover:border-white/40">
                    <Save size={18} /> {isEditing ? 'Save Changes' : 'Create Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Notifications */}
        {notification && (
          <div
            className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 rounded-xl border border-zinc-800 px-6 py-4 shadow-2xl ${
              notification.type === 'error' ? 'bg-zinc-900 text-zinc-50' : 'bg-zinc-50 text-zinc-950'
            }`}
          >
            <CheckCircle2 size={20} />
            <p className="font-medium">{notification.msg}</p>
          </div>
        )}
    </div>
  );
};

export default AdminDashboard;
