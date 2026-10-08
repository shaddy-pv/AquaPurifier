import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw,
  Droplets
} from "lucide-react";
import { adminApi, AdminProduct } from "@/lib/api";
import { toast } from "sonner";

export default function Products() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "ro",
    stock: "",
    features: "",
    images: "/placeholder.svg"
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.products.getAll();
      setProducts(data.products || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load products";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "ro",
      stock: "20",
      features: "7-Stage RO, Mineral Guard, Smart Display",
      images: "/placeholder.svg"
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (p: AdminProduct) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : "",
      category: p.category || "ro",
      stock: p.stock.toString(),
      features: p.features ? p.features.join(", ") : "",
      images: p.images && p.images[0] ? p.images[0] : "/placeholder.svg"
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error("Please fill in Name, Price, and Stock");
      return;
    }

    setSubmitting(true);
    const payload = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: formData.description || "High-efficiency pure water filtration system.",
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      category: formData.category,
      stock: Number(formData.stock),
      features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
      images: [formData.images]
    };

    try {
      const pId = editingProduct ? (editingProduct.id || editingProduct._id) : null;
      if (pId) {
        await adminApi.products.update(pId, payload);
        toast.success("Product updated successfully!");
      } else {
        await adminApi.products.create(payload);
        toast.success("New product published!");
      }
      setDialogOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving product";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete "${name}"?`)) return;

    try {
      await adminApi.products.delete(id);
      toast.success(`Product "${name}" deleted`);
      fetchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      toast.error(msg);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <AdminLayout
      title="Product Catalog & Inventory"
      description="Manage water purifier models, modify pricing, set inventory stock levels"
    >
      <div className="space-y-6">
        {/* Actions & Filters Bar */}
        <Card className="border border-sky-100 bg-white">
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base text-slate-900 font-bold">Catalog Directory</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search purifiers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-xs border-sky-100"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-36 text-xs border-sky-100">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="ro">RO Systems</SelectItem>
                  <SelectItem value="uv">UV Purifiers</SelectItem>
                  <SelectItem value="alkaline">Alkaline</SelectItem>
                  <SelectItem value="copper">Copper RO</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchProducts}
                disabled={loading}
                className="border-sky-100 text-slate-600 hover:text-primary"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>

              <Button
                onClick={handleOpenAdd}
                className="bg-gradient-primary hover:shadow-soft text-white text-xs flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-sky-50/60 text-xs uppercase tracking-wider text-slate-500 border-b border-sky-100">
                  <tr>
                    <th className="py-3.5 px-6">Product</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Price</th>
                    <th className="py-3.5 px-6">Stock Status</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No products match your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const pId = p.id || p._id || "prod";
                      return (
                        <tr key={pId} className="hover:bg-sky-50/30 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 overflow-hidden">
                                {p.images && p.images[0] && p.images[0] !== "/placeholder.svg" ? (
                                  <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                                ) : (
                                  <Droplets className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate max-w-xs">{p.name}</p>
                                <p className="text-xs text-slate-400 truncate">/{p.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 uppercase text-xs font-bold text-primary">
                            {p.category}
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-bold text-slate-900">₹{p.price.toLocaleString()}</p>
                            {p.originalPrice && (
                              <p className="text-xs text-slate-400 line-through">₹{p.originalPrice.toLocaleString()}</p>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <Badge 
                              variant="outline"
                              className={
                                p.stock <= 5
                                  ? "bg-red-50 text-red-700 border-red-200 text-xs"
                                  : p.stock < 15
                                  ? "bg-amber-50 text-amber-700 border-amber-200 text-xs"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                              }
                            >
                              {p.stock} units
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                              Live Store
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(p)}
                              className="h-8 text-xs text-slate-600 hover:text-primary hover:bg-sky-50"
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(pId, p.name)}
                              className="h-8 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-sky-50">
              {filteredProducts.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  No products found.
                </div>
              ) : (
                filteredProducts.map((p) => {
                  const pId = p.id || p._id || "prod";
                  return (
                    <div key={pId} className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {p.images && p.images[0] && p.images[0] !== "/placeholder.svg" ? (
                            <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <Droplets className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 text-sm truncate">{p.name}</p>
                          <p className="text-xs text-primary uppercase font-bold">{p.category}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-slate-900 text-sm">₹{p.price.toLocaleString()}</p>
                          <Badge 
                            variant="outline"
                            className={
                              p.stock <= 5
                                ? "bg-red-50 text-red-700 border-red-200 text-xs mt-0.5"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs mt-0.5"
                            }
                          >
                            {p.stock} in stock
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-sky-50">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(p)}
                          className="h-8 text-xs border-sky-100 text-slate-700 hover:text-primary flex-1"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(pId, p.name)}
                          className="h-8 text-xs border-sky-100 text-slate-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border border-sky-100 bg-white max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-premium">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingProduct ? "Edit Purifier Specifications" : "Publish New Product"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update catalog details, pricing, inventory units, and marketing features
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs pt-2">
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-semibold">Product Title *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. PRAYAG RO Copper & Zinc Alkaline 10L"
                className="text-sm border-sky-100"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold">Selling Price (₹) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="14999"
                  className="text-sm border-sky-100"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold">Original MRP (₹)</Label>
                <Input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="19999"
                  className="text-sm border-sky-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="text-xs border-sky-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ro">RO Systems</SelectItem>
                    <SelectItem value="uv">UV Purifiers</SelectItem>
                    <SelectItem value="alkaline">Alkaline Systems</SelectItem>
                    <SelectItem value="copper">Copper RO</SelectItem>
                    <SelectItem value="commercial">Commercial Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold">Available Units in Stock *</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="25"
                  className="text-sm border-sky-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-700 font-semibold">Image Asset URL</Label>
              <Input
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder="/placeholder.svg or https://images..."
                className="text-sm border-sky-100"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-700 font-semibold">Features (comma-separated)</Label>
              <Input
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="7-Stage RO, Mineral Guard, TDS Controller"
                className="text-sm border-sky-100"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-700 font-semibold">Description</Label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed purification specifications..."
                className="text-sm border-sky-100"
              />
            </div>

            <DialogFooter className="pt-4 flex flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(false)}
                className="border-sky-100 text-slate-600 hover:text-slate-800 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="bg-gradient-primary text-white text-xs"
              >
                {submitting ? "Saving..." : editingProduct ? "Save Changes" : "Publish Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
