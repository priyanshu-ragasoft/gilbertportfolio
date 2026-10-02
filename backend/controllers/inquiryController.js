import Inquiry from '../models/Inquiry.js'

// @desc    Get all contact inquiries
// @route   GET /api/inquiries
// @access  Private (Admin Only)
export const getInquiries = async (req, res, next) => {
  try {
    const { status, type, search } = req.query
    const query = {}

    if (status) query.status = status
    if (type) query.type = type
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ]
    }

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 })
    const total = await Inquiry.countDocuments(query)

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      data: inquiries,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Submit a new contact message / donation inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create(req.body)
    res.status(201).json({
      success: true,
      data: inquiry,
      message: 'Thank you. Your message has been received securely.',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private (Admin Only)
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' })
    }

    res.status(200).json({
      success: true,
      data: inquiry,
      message: 'Status updated successfully',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Admin Only)
export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params
    const inquiry = await Inquiry.findByIdAndDelete(id)

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
