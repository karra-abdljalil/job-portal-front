"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {fetchAllCompanies,getCompanyById,updateCompanyById} from "@/api/admin/Companies"


export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    logo: "",
    description: "",
    industry: "",
    location: "",
  });

  // New state for search, filters, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Matches API default limit

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery,
        industry: industryFilter,
        location: locationFilter,
        page: currentPage,
        limit: itemsPerPage,
      };
      // Assuming fetchAllCompanies can take a query parameters object
      const data = await fetchAllCompanies(params);
      setCompanies(data.data || []); // Ensure data.data is an array
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to trigger fetching when pagination or filters change, with debounce for filters
  useEffect(() => {
    const handler = setTimeout(() => {
      loadCompanies();
    }, 300); // Debounce search/filter inputs for 300ms

    // Cleanup function for debounce
    return () => clearTimeout(handler);
  }, [searchQuery, industryFilter, locationFilter, currentPage, itemsPerPage]); // All dependencies

  // Effect to reset current page to 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, industryFilter, locationFilter]);


  const handleEdit = async (id) => {
    try {
      const data = await getCompanyById(id);
      setSelectedCompany(data); // Assuming data is { data: companyObject }
      setForm({
        company_name: data.data?.company_name || "",
        logo: data.data?.logo || "",
        description: data.data?.description || "",
        industry: data.data?.industry || "",
        location: data.data?.location || "",
      });
      setOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateCompanyById(selectedCompany.data?.id, form); // Ensure selectedCompany.data.id is used
      setOpen(false);
      loadCompanies(); // Reload companies after update
    } catch (err) {
      console.error(err);
    }
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Companies</h1>

      {/* Filter and Search Inputs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search company name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Filter by industry..."
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="flex-1"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies?.length > 0 ? (
                    companies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>{company.company_name}</TableCell>
                        <TableCell>{company.industry}</TableCell>
                        <TableCell>{company.location}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(company.id)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">No companies found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                  Previous
                </Button>
                <span className="text-sm text-gray-700">Page {currentPage}</span>
                {/* Disable Next if fewer companies than itemsPerPage were returned, implying no more pages */}
                <Button onClick={handleNextPage} disabled={companies.length < itemsPerPage}>
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Company Name"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            />

            <Input
              placeholder="Logo URL"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
            />

            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <Input
              placeholder="Industry"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
            />

            <Input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <Button onClick={handleUpdate} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
