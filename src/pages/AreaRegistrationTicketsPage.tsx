import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import Page from '../components/Page'
import Table, { type TableColumn } from '../components/Table'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import RejectModal from '../components/RejectModal'

interface AreaTicket {
  id: string
  userName: string
  userEmail: string
  userPhone?: string
  areaName: string
  address: string
  city: string
  postalCode?: string
  landmark?: string
  createdAt: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
}

// Mock data - will be replaced with API call later
const mockTickets: AreaTicket[] = [
  {
    id: '1',
    userName: 'Ahmed Ali',
    userEmail: 'ahmed.ali@example.com',
    userPhone: '+92 300 1234567',
    areaName: 'Gulshan-e-Iqbal',
    address: 'Block 15, Street 5',
    city: 'Karachi',
    postalCode: '75300',
    landmark: 'Near Masjid-e-Noor',
    createdAt: '2024-01-15T14:20:00',
    status: 'pending',
  },
  {
    id: '2',
    userName: 'Fatima Khan',
    userEmail: 'fatima.khan@example.com',
    userPhone: '+92 301 2345678',
    areaName: 'DHA Phase 5',
    address: 'Street 12, House 45',
    city: 'Karachi',
    postalCode: '75500',
    landmark: 'Opposite DHA Park',
    createdAt: '2024-01-15T15:45:00',
    status: 'pending',
  },
  {
    id: '3',
    userName: 'Hassan Raza',
    userEmail: 'hassan.raza@example.com',
    userPhone: '+92 302 3456789',
    areaName: 'Clifton Block 9',
    address: 'Seaview Apartments, Flat 302',
    city: 'Karachi',
    postalCode: '75600',
    landmark: 'Near Clifton Beach',
    createdAt: '2024-01-14T16:30:00',
    status: 'pending',
  },
]

export default function AreaRegistrationTicketsPage() {
  const [tickets, setTickets] = useState<AreaTicket[]>(mockTickets)
  const [selectedTicket, setSelectedTicket] = useState<AreaTicket | null>(null)
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

  const handleRowClick = (ticket: AreaTicket) => {
    setSelectedTicket(ticket)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTicket(null)
  }

  const columns: TableColumn<AreaTicket>[] = [
    {
      key: 'user',
      header: 'User',
      render: (ticket) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{ticket.userName}</div>
          <div className="text-sm text-gray-500">{ticket.userEmail}</div>
        </div>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'areaDetails',
      header: 'Area Details',
      render: (ticket) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{ticket.areaName}</div>
          <div className="text-sm text-gray-500">{ticket.city}</div>
        </div>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'address',
      header: 'Address',
      render: (ticket) => (
        <div className="text-sm text-gray-900 max-w-xs">{ticket.address}</div>
      ),
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Area Registration Tickets</h1>
              <p className="text-gray-600">Review and approve area registration requests</p>
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
            title="Area Registration Details"
          >
            {selectedTicket && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.userName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.userEmail}</p>
                  </div>
                  {selectedTicket.userPhone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">User Phone</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.userPhone}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area Name</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.areaName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.city}</p>
                  </div>
                  {selectedTicket.postalCode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.postalCode}</p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.address}</p>
                  </div>
                  {selectedTicket.landmark && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.landmark}</p>
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
            title="Reject Area Registration"
            itemName={rejectTicketId ? tickets.find(t => t.id === rejectTicketId)?.areaName : undefined}
          />
        </div>
      </DashboardLayout>
    </Page>
  )
}

