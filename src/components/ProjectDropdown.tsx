import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ProjectDropdown({ value, onChange, required = false, placeholder = "Select project..." }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/projects');
        setProjects(res.data.map(p => ({ value: p._id, label: p.name })));
      } catch (err) {
        console.error("Project dropdown error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (required && !value && projects.length > 0) {
      onChange(projects[0].value);
    }
  }, [required, value, projects, onChange]);

  return (
    <select
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={loading}
    >
      <option value="">{placeholder}</option>
      {projects.map(p => (
        <option key={p.value} value={p.value}>{p.label}</option>
      ))}
    </select>
  );
}
