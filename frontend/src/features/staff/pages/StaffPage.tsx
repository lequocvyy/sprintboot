import { useState } from 'react'
import {
  useCreateStaff,
  useStaffs,
  useUpdateStaffStatus,
} from '@/features/staff/hooks/useStaffs'
import type { CreateStaffRequest, StaffResponse } from '@/types/staff'
import axios from 'axios'

const initialForm: CreateStaffRequest = {
  username: '',
  email: '',
  password: '',
  fullName: '',
  role: 'SHOP_STAFF',
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Có lỗi xảy ra'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Có lỗi xảy ra'
}

function getRoleBadge(role: string) {
  if (role === 'SHOP_OWNER') {
    return 'bg-purple-100 text-purple-700'
  }

  if (role === 'SHOP_MANAGER') {
    return 'bg-amber-100 text-amber-700'
  }

  if (role === 'SHOP_STAFF') {
    return 'bg-blue-100 text-blue-700'
  }

  return 'bg-slate-100 text-slate-700'
}

export default function StaffPage() {
  const { data, isLoading, isError, error, refetch } = useStaffs()
  const createStaffMutation = useCreateStaff()
  const updateStaffStatusMutation = useUpdateStaffStatus()

  const [form, setForm] = useState<CreateStaffRequest>(initialForm)
  const [successMessage, setSuccessMessage] = useState('')

  const staffs = data ?? []

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')

    try {
      await createStaffMutation.mutateAsync(form)
      setSuccessMessage('Tạo staff thành công')
      setForm(initialForm)
    } catch {
      // error handled below
    }
  }

  const handleToggleStatus = async (staff: StaffResponse) => {
    try {
      await updateStaffStatusMutation.mutateAsync({
        id: staff.id,
        payload: {
          enabled: !staff.enabled,
        },
      })
      setSuccessMessage(
        staff.enabled
          ? `Đã disable tài khoản ${staff.username}`
          : `Đã enable tài khoản ${staff.username}`
      )
    } catch {
      // error handled below
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <p className="mt-2 text-slate-600">
          Quản lý tài khoản nhân viên trong shop của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
          <h2 className="text-lg font-semibold text-slate-900">Tạo staff mới</h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                placeholder="nhanvien01"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                placeholder="Nguyen Van A"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                placeholder="staff@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              >
                <option value="SHOP_STAFF">SHOP_STAFF</option>
                
                <option value="SHOP_MANAGER">SHOP_MANAGER</option>
              </select>
            </div>

            {successMessage && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            {createStaffMutation.isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {getErrorMessage(createStaffMutation.error)}
              </div>
            )}

            <button
              type="submit"
              disabled={createStaffMutation.isPending}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createStaffMutation.isPending ? 'Đang tạo...' : 'Tạo staff'}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Danh sách staff
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tổng cộng: {staffs.length}
              </p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-slate-500">Đang tải staff...</p>
          ) : isError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <p>Không tải được danh sách staff.</p>
              <p className="mt-1 text-sm">{getErrorMessage(error)}</p>
              <button
                onClick={() => refetch()}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Thử lại
              </button>
            </div>
          ) : staffs.length === 0 ? (
            <p className="text-slate-500">Chưa có staff nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="pb-3 pr-4">Full name</th>
                    <th className="pb-3 pr-4">Username</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Role</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {staffs.map((staff: StaffResponse) => (
                    <tr key={staff.id} className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-medium text-slate-900">
                        {staff.fullName}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {staff.username}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {staff.email}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-2">
                          {staff.roles.map((role) => (
                            <span
                              key={role}
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getRoleBadge(role)}`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            staff.enabled
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {staff.enabled ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <button
                          onClick={() => handleToggleStatus(staff)}
                          disabled={updateStaffStatusMutation.isPending}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white ${
                            staff.enabled
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-green-600 hover:bg-green-700'
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          {staff.enabled ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {updateStaffStatusMutation.isError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {getErrorMessage(updateStaffStatusMutation.error)}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}