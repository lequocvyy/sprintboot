export interface StaffResponse {
  id: number
  username: string
  email: string
  fullName: string
  enabled: boolean
  shopId: number | null
  shopName: string | null
  roles: string[]
}

export interface CreateStaffRequest {
  username: string
  email: string
  password: string
  fullName: string
  role: string
}

export interface UpdateStaffStatusRequest {
  enabled: boolean
}