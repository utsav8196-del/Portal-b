import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Users2 } from "lucide-react";
import Swal from "sweetalert2";
import UserForm from "../components/user/UserForm";
import DataTable from "../components/ui/DataTable";
import { deleteUser, getUserById, getUsers } from "../services/userService";
import { getCountries } from "../services/countryService";
import UserViewModal from "../components/user/UserViewModal";

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewUserData, setViewUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAllUsers = () => {
    setLoading(true);

    const requestData = {
      page_number: currentPage,
      page_size: entriesPerPage,
      search_value: searchQuery,
      sort_by: "user_name",
      sort_as: "asc",
    };

    getUsers(requestData)
      .then((response) => {
        if (response) {
          const items = response.data.items;
          const transformed = items.map((item: any) => ({
            ...item,
            id: item.user_id,
            status: item.user_status,
          }));
          setUsers(transformed);
          setTotalPages(response.data.page_info.total_page);
          setTotalEntries(response.data.page_info.total_count);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch users", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getAllUsers();
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
      const user = await getUserById(id);
      setViewUserData(user);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch user by ID", error);
    }
  };

  const columns = [
    {
      header: "Name",
      accessor: "user_name",
      render: (value: string, row: any) => (
        <div
          className="flex items-center space-x-2 cursor-pointer text-blue-600"
          onClick={() => handleView(row.id)}
        >
          <span>{value}</span>
        </div>
      ),
    },
    { header: "Email", accessor: "user_email" },
    { header: "Phone", accessor: "user_phone" },
    {
      header: "Date",
      accessor: "created_at",
      render: (value: string) =>
        new Intl.DateTimeFormat("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(value)),
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
      await deleteUser(id);
      getAllUsers();
      Swal.fire("Deleted!", "The user has been deleted.", "success");
    }
  };

  const handleEdit = async (item) => {
    await fetchCountries();

    const mappedData = {
      id: item.user_id,
      name: item.user_name,
      email: item.user_email,
      phone: item.user_phone,
      countryId: item.user_country_id,
    };

    setSelectedUser(mappedData);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        {/* <button
          className="inline-flex items-center cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={async () => {
            await fetchCountries();
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          Add User
        </button> */}
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
        <DataTable
          data={users}
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
          // renderActions={(row) => (
          //   <div className="flex space-x-2 items-center">
          //     <button
          //       onClick={() => handleEdit(row)}
          //       className="text-blue-600 hover:text-blue-900 cursor-pointer"
          //     >
          //       <Pencil size={18} />
          //     </button>
          //     <button
          //       onClick={() => handleDelete(row.id)}
          //       className="text-red-600 hover:text-red-900 cursor-pointer"
          //     >
          //       <Trash2 size={18} />
          //     </button>
          //   </div>
          // )}
        />
      </div>

      {isModalOpen && (
        <UserForm
          isOpen={isModalOpen}
          countries={countries}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={() => {
            getAllUsers();
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          initialData={selectedUser ?? {}}
        />
      )}

      {isViewModalOpen && (
        <UserViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          data={viewUserData}
        />
      )}
    </div>
  );
};

export default Users;
