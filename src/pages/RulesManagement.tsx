import { useState, useEffect } from "react";
import { Pencil, Plus, Scale, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import DataTable from "../components/ui/DataTable";
import RuleForm from "../components/rule/RuleForm";
import { deleteRule, getRuleById, getRules } from "../services/ruleService";
import { getCountries } from "../services/countryService";
import RuleViewModal from "../components/rule/RuleViewModal";

const RulesManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rules, setRules] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRuleData, setViewRuleData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAllRules = () => {
    setLoading(true);

    const requestData = {
      page_number: currentPage,
      page_size: entriesPerPage,
      search_value: searchQuery,
      sort_by: "rule_title",
      sort_as: "asc",
    };

    getRules(requestData)
      .then((response) => {
        if (response) {
          const items = response.data.items;
          const transformed = items.map((item: any) => ({
            ...item,
            id: item.rule_id,
          }));
          setRules(transformed);
          setTotalPages(response.data.page_info.total_page);
          setTotalEntries(response.data.page_info.total_count);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch rules", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getAllRules();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, entriesPerPage, searchQuery]);

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
      }));
      setCountries(mapped);
    } catch (error) {
      console.error("Failed to fetch countries", error);
    }
  };

  const handleView = async (id: number) => {
    try {
      const rule = await getRuleById(id);
      setViewRuleData(rule);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch rule by ID", error);
    }
  };

  const columns = [
    { header: "Country", accessor: "rule_country_name" },
    {
      header: "Rule title",
      accessor: "rule_title",
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
      header: "Date Added",
      accessor: "created_at",
      render: (value: string) =>
        new Intl.DateTimeFormat("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(value)),
    },
  ];

  const handleDelete = async (id: string) => {
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
      await deleteRule(id);
      getAllRules();
      Swal.fire("Deleted!", "The rule has been deleted.", "success");
    }
  };

  const handleEdit = async (item) => {
    await fetchCountries();

    const mappedData = {
      id: item.rule_id,
      title: item.rule_title,
      details: item.rule_description,
      countryId: item.rule_country_id,
    };

    setSelectedRule(mappedData);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Rules Management</h1>
        <button
          className="inline-flex items-center cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={async () => {
            await fetchCountries();
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          Add Rule
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
        <DataTable
          data={rules}
          columns={columns}
          currentPage={currentPage}
          totalPages={totalPages}
          entriesPerPage={entriesPerPage}
          totalEntries={totalEntries}
          onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
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
        <RuleForm
          isOpen={isModalOpen}
          countries={countries}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRule(null);
          }}
          onSubmit={() => {
            getAllRules();
            setIsModalOpen(false);
            setSelectedRule(null);
          }}
          initialData={selectedRule ?? {}}
        />
      )}

      {isViewModalOpen && (
        <RuleViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          data={viewRuleData}
        />
      )}
    </div>
  );
};

export default RulesManagement;
