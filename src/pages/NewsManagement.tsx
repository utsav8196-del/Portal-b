import React, { useEffect, useState } from "react";
import { Columns, Newspaper, Pencil, Plus, Trash2 } from "lucide-react";
import NewsForm from "../components/news/NewsForm";
import DataTable from "../components/ui/DataTable";
import Swal from "sweetalert2";
import {
  deleteNews,
  getNews,
  getNewsById,
  updateNewsStatus,
} from "../services/newsService";
import { getCountries } from "../services/countryService";
import NewsViewModal from "../components/news/NewsViewModal";

const NewsManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [news, setNews] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewNewsData, setViewNewsData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAllNews = () => {
    setLoading(true);

    const requestData = {
      page_number: currentPage,
      page_size: entriesPerPage,
      search_value: searchQuery,
      sort_by: "news_title",
      sort_as: "asc",
    };

    getNews(requestData)
      .then((response) => {
        if (response) {
          const items = response.data.items;
          const transformed = items.map((item: any) => ({
            ...item,
            id: item.news_id,
            status: item.news_status,
          }));
          setNews(transformed);
          setTotalPages(response.data.page_info.total_page);
          setTotalEntries(response.data.page_info.total_count);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch news", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getAllNews();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage, entriesPerPage]);

  const fetchCountries = async () => {
    const requestData = {
      page_number: 1,
      page_size: 9999,
      search_value: "",
      sort_by: "country_name",
      sort_as: "asc",
    };
    try {
      const response = await getCountries(requestData);
      const mapped = response.data.items.map((country: any) => ({
        value: country.country_id,
        label: country.country_name,
      }));
      setCountries(mapped);
    } catch (error) {
      console.error("Failed to fetch countries", error);
    }
  };

  const handleView = async (id: number) => {
    try {
      const news = await getNewsById(id);
      setViewNewsData(news);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch news by ID", error);
    }
  };

  const columns = [
    {
      header: "Title",
      accessor: "news_title",
      render: (value: string, row: any) => (
        <div
          className="flex items-center space-x-2 cursor-pointer text-blue-600"
          onClick={() => handleView(row.id)}
        >
          <span>{value}</span>
        </div>
      ),
    },
    {
      header: "Url",
      accessor: "news_url",
      render: (value: string) => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {value}
        </a>
      ),
      truncate: true,
    },
    {
      header: "Status",
      accessor: "news_status",
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
      await deleteNews(id);
      getAllNews();
      Swal.fire("Deleted!", "The news has been deleted.", "success");
    }
  };

  const handleEdit = async (item) => {
    await fetchCountries();

    const mappedData = {
      id: item.news_id,
      title: item.news_title,
      url: item.news_url,
      description: item.news_description,
      countryId: item.news_country_id,
      status: item.news_status,
    };

    setSelectedNews(mappedData);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (item: any) => {
    try {
      const newStatus = !item.news_status;
      await updateNewsStatus(item.news_id, newStatus);
      getAllNews();
      Swal.fire({
        title: "Success",
        text: `News has been ${newStatus ? "activated" : "deactivated"}.`,
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update news status.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          News Article Management
        </h1>
        <button
          onClick={async () => {
            await fetchCountries();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="mr-2" size={16} />
          Add Article
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
        <DataTable
          data={news}
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
        <NewsForm
          isOpen={isModalOpen}
          countries={countries}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNews(null);
          }}
          onSubmit={() => {
            getAllNews();
            setIsModalOpen(false);
            setSelectedNews(null);
          }}
          initialData={selectedNews ?? {}}
        />
      )}

      {isViewModalOpen && (
        <NewsViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          data={viewNewsData}
        />
      )}
    </div>
  );
};

export default NewsManagement;
