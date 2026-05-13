import { useState, useEffect } from "react";
import { Briefcase, Pencil, Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import DataTable from "../components/ui/DataTable";
import JobForm from "../components/job/JobForm";
import {
  deleteJob,
  getJobById,
  getJobs,
  updateJobStatus,
} from "../services/jobService";
import { getCountries } from "../services/countryService";
import JobViewModal from "../components/job/JobViewModal";

const JobManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewJobData, setViewJobData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAllJobs = () => {
    setLoading(true);

    const requestData = {
      page_number: currentPage,
      page_size: entriesPerPage,
      search_value: searchQuery,
      sort_by: "job_title",
      sort_as: "asc",
    };

    getJobs(requestData)
      .then((response) => {
        if (response) {
          const items = response.data.items;
          const transformed = items.map((item: any) => ({
            ...item,
            id: item.job_id,
            status: item.job_status,
          }));

          setJobs(transformed);
          setTotalPages(response.data.page_info.total_page);
          setTotalEntries(response.data.page_info.total_count);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch jobs", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getAllJobs();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage, entriesPerPage]);

  const fetchCountries = async () => {
    try {
      const response = await getCountries({
        page_number: 1,
        page_size: 9999,
        search_value: "",
        sort_by: "country_name",
        sort_as: "asc",
      });
      const mapped = response.data.items.map((country: any) => ({
        value: country.country_id,
        label: country.country_name,
        currencySymbol: country.country_currency,
      }));
      setCountries(mapped);
    } catch (error) {
      console.error("Failed to fetch countries", error);
    }
  };

  const handleView = async (id: number) => {
    try {
      const job = await getJobById(id);
      setViewJobData(job);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch job by ID", error);
    }
  };

  const columns = [
    {
      header: "Job Title",
      accessor: "job_title",
      render: (value: string, row: any) => (
        <div
          className="flex items-center space-x-2 cursor-pointer text-blue-600"
          onClick={() => handleView(row.id)}
        >
          <span>{value}</span>
        </div>
      ),
    },
    { header: "Country", accessor: "job_country_name" },
    { header: "Location", accessor: "job_location" },
    {
      header: "Salary",
      accessor: "job_salary",
      render: (_value, row) => {
        const formatNumber = (num) =>
          new Intl.NumberFormat("en-IN").format(num);

        return (
          <span>
            {row.job_country_currency}
            {formatNumber(row.job_salary_min)} - {row.job_country_currency}
            {formatNumber(row.job_salary_max)}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: "job_status",
      render: (_value, row: any) => (
        <div className="flex items-center">
          <button
            onClick={() => handleToggleStatus(row)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              row.status ? "bg-green-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                row.status ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="ml-3 text-sm text-gray-500">
            {row.status ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deleteJob(id);
      getAllJobs();
      Swal.fire("Deleted!", "The job has been deleted.", "success");
    }
  };

  const handleEdit = async (item) => {
    await fetchCountries();
    const mappedData = {
      id: item.job_id,
      title: item.job_title,
      description: item.job_description,
      location: item.job_location,
      salaryMin: item.job_salary_min,
      salaryMax: item.job_salary_max,
      countryId: item.job_country_id,
      status: item.job_status,
    };

    setSelectedJob(mappedData);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (item: any) => {
    try {
      const newStatus = !item.job_status;
      await updateJobStatus(item.job_id, newStatus);
      getAllJobs();
      Swal.fire({
        title: "Success",
        text: `Job has been ${newStatus ? "activated" : "deactivated"}.`,
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update job status.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
        <button
          className="inline-flex items-center cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={async () => {
            await fetchCountries();
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          Add Job
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
        <DataTable
          data={jobs}
          columns={columns}
          currentPage={currentPage}
          totalPages={totalPages}
          entriesPerPage={entriesPerPage}
          totalEntries={totalEntries}
          onPageChange={(page) => setCurrentPage(page)}
          onEntriesPerPageChange={(entries) => {
            setEntriesPerPage(entries);
            setCurrentPage(1);
          }}
          onSearch={(query) => {
            setSearchQuery(query);
            setCurrentPage(1);
          }}
          loading={loading}
          renderActions={(row) => (
            <div className="flex space-x-2 items-center">
              <button
                onClick={() => handleEdit(row)}
                className="text-blue-600 hover:text-blue-900 cursor-pointer"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="text-red-600 hover:text-red-900 cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        />
      </div>

      {isModalOpen && (
        <JobForm
          isOpen={isModalOpen}
          countries={countries}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedJob(null);
          }}
          onSubmit={() => {
            getAllJobs();
            setIsModalOpen(false);
            setSelectedJob(null);
          }}
          initialData={selectedJob ?? {}}
        />
      )}

      {isViewModalOpen && (
        <JobViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          data={viewJobData}
        />
      )}
    </div>
  );
};

export default JobManagement;
