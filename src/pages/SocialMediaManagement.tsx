import React, { useEffect, useState } from "react";
import { Pencil, Plus, Share2, Trash2 } from "lucide-react";
import SocialMediaForm from "../components/social/SocialMediaForm";
import DataTable from "../components/ui/DataTable";
import Swal from "sweetalert2";
import {
  deletePost,
  getPostById,
  getPosts,
  updatePostStatus,
} from "../services/socialmediaService";
import { getCountries } from "../services/countryService";
import SocialMediaViewModal from "../components/social/SocialMediaViewModal";

const SocialMediaManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewPostData, setViewPostData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAllPosts = () => {
    setLoading(true);

    const requestData = {
      page_number: currentPage,
      page_size: entriesPerPage,
      search_value: searchQuery,
      sort_by: "social_media_title",
      sort_as: "asc",
    };

    getPosts(requestData)
      .then((response) => {
        if (response) {
          const items = response.data.items;
          const transformed = items.map((item: any) => ({
            ...item,
            id: item.social_media_id,
            status: item.social_media_status,
          }));
          setPosts(transformed);
          setTotalPages(response.data.page_info.total_page);
          setTotalEntries(response.data.page_info.total_count);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch posts", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getAllPosts();
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
      const post = await getPostById(id);
      setViewPostData(post);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch post by ID", error);
    }
  };

  const columns = [
    {
      header: "Title",
      accessor: "social_media_title",
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
      accessor: "social_media_url",
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
      accessor: "social_media_status",
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
      await deletePost(id);
      getAllPosts();
      Swal.fire("Deleted!", "The post has been deleted.", "success");
    }
  };

  const handleEdit = async (item) => {
    await fetchCountries();

    const mappedData = {
      id: item.social_media_id,
      title: item.social_media_title,
      url: item.social_media_url,
      platform: item.social_media_platform,
      description: item.social_media_description,
      countryId: item.social_media_country_id,
      status: item.social_media_status,
    };

    setSelectedPost(mappedData);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (item: any) => {
    try {
      const newStatus = !item.social_media_status;
      await updatePostStatus(item.social_media_id, newStatus);
      getAllPosts();
      Swal.fire({
        title: "Success",
        text: `Post has been ${newStatus ? "activated" : "deactivated"}.`,
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update post status.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Social Media Management
        </h1>
        <button
          onClick={async () => {
            await fetchCountries();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="mr-2" size={16} />
          Add Post
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
        <DataTable
          data={posts}
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
        <SocialMediaForm
          isOpen={isModalOpen}
          countries={countries}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPost(null);
          }}
          onSubmit={() => {
            getAllPosts();
            setIsModalOpen(false);
            setSelectedPost(null);
          }}
          initialData={selectedPost ?? {}}
        />
      )}

      {isViewModalOpen && (
        <SocialMediaViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          data={viewPostData}
        />
      )}
    </div>
  );
};

export default SocialMediaManagement;
