import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import Page from '../components/Page'
import Table, { type TableColumn } from '../components/Table'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import RejectModal from '../components/RejectModal'

interface UserTicket {
  id: string
  name: string
  email: string
  phone: string
  cnic?: string
  address?: string
  city?: string
  createdAt: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
}

// Mock data - will be replaced with API call later
const mockTickets: UserTicket[] = [
  {
    id: '1',
    name: 'Ahmed Ali',
    email: 'ahmed.ali@example.com',
    phone: '+92 300 1234567',
    cnic: '42101-1234567-1',
    address: 'House No. 45, Block 15, Street 5',
    city: 'Karachi',
    createdAt: '2024-01-15T10:30:00',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Fatima Khan',
    email: 'fatima.khan@example.com',
    phone: '+92 301 2345678',
    cnic: '42101-2345678-2',
    address: 'Flat 302, Seaview Apartments',
    city: 'Karachi',
    createdAt: '2024-01-15T11:15:00',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Hassan Raza',
    email: 'hassan.raza@example.com',
    phone: '+92 302 3456789',
    cnic: '42101-3456789-3',
    address: 'Street 12, House 45, DHA Phase 5',
    city: 'Karachi',
    createdAt: '2024-01-14T09:20:00',
    status: 'pending',
  },
]

export default function UserRegistrationTicketsPage() {
  const [tickets, setTickets] = useState<UserTicket[]>(mockTickets)
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rejectTicketId, setRejectTicketId] = useState<string | null>(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)

  // Only show pending tickets
  const filteredTickets = tickets.filter(ticket => ticket.status === 'pending')

  const handleApprove = (id: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, status: 'approved' as const } : ticket
    ))
  }

  const handleRejectClick = (id: string) => {
    setRejectTicketId(id)
    setIsRejectModalOpen(true)
  }

  const handleRejectConfirm = (reason: string) => {
    if (rejectTicketId) {
      setTickets(tickets.map(ticket => 
        ticket.id === rejectTicketId 
          ? { ...ticket, status: 'rejected' as const, rejectionReason: reason } 
          : ticket
      ))
      setIsRejectModalOpen(false)
      setRejectTicketId(null)
      
      // Close detail modal if open
      if (isModalOpen && selectedTicket?.id === rejectTicketId) {
        closeModal()
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleRowClick = (ticket: UserTicket) => {
    setSelectedTicket(ticket)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTicket(null)
  }

  const columns: TableColumn<UserTicket>[] = [
    {
      key: 'userDetails',
      header: 'User Details',
      render: (ticket) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{ticket.name}</div>
          <div className="text-sm text-gray-500">{ticket.email}</div>
        </div>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'phone',
      header: 'Contact',
      render: (ticket) => (
        <div className="text-sm text-gray-900">{ticket.phone}</div>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (ticket) => (
        <div className="text-sm text-gray-900">{formatDate(ticket.createdAt)}</div>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'status',
      header: 'Status',
      render: (ticket) => <StatusBadge status={ticket.status} />,
      className: 'whitespace-nowrap',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (ticket) => (
        <div className="text-sm font-medium" onClick={(e) => e.stopPropagation()}>
          {ticket.status === 'pending' ? (
            <div className="flex space-x-2">
              <button
                onClick={() => handleApprove(ticket.id)}
                className="text-green-600 hover:text-green-900 font-semibold"
              >
                Approve
              </button>
              <button
                onClick={() => handleRejectClick(ticket.id)}
                className="text-red-600 hover:text-red-900 font-semibold"
              >
                Reject
              </button>
            </div>
          ) : (
            <span className="text-gray-400">No action</span>
          )}
        </div>
      ),
      className: 'whitespace-nowrap',
    },
  ]

  return (
    <Page>
      <DashboardLayout>
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Registration Tickets</h1>
              <p className="text-gray-600">Review and approve user registration requests</p>
            </div>
          </div>


          {/* Tickets Table */}
          <Table
            columns={columns}
            data={filteredTickets}
            emptyMessage="No tickets found"
            getRowKey={(ticket) => ticket.id}
            onRowClick={handleRowClick}
          />

          {/* Detail Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="User Registration Details"
          >
            {selectedTicket && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.phone}</p>
                  </div>
                  {selectedTicket.cnic && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.cnic}</p>
                    </div>
                  )}
                  {selectedTicket.address && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.address}</p>
                    </div>
                  )}
                  {selectedTicket.city && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.city}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <StatusBadge status={selectedTicket.status} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{formatDate(selectedTicket.createdAt)}</p>
                  </div>
                  {selectedTicket.rejectionReason && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                      <p className="text-sm text-gray-900 bg-red-50 border border-red-200 p-3 rounded-lg">{selectedTicket.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {selectedTicket.status === 'pending' && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleApprove(selectedTicket.id)
                        closeModal()
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Approve Registration
                    </button>
                    <button
                      onClick={() => {
                        closeModal()
                        handleRejectClick(selectedTicket.id)
                      }}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Reject Registration
                    </button>
                  </div>
                )}
              </div>
            )}
          </Modal>

          {/* Reject Modal */}
          <RejectModal
            isOpen={isRejectModalOpen}
            onClose={() => {
              setIsRejectModalOpen(false)
              setRejectTicketId(null)
            }}
            onConfirm={handleRejectConfirm}
            title="Reject User Registration"
            itemName={rejectTicketId ? tickets.find(t => t.id === rejectTicketId)?.name : undefined}
          />
        </div>
      </DashboardLayout>
    </Page>
  )
}

