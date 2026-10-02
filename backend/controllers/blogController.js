import Blog from '../models/Blog.js'

// @desc    Get all blogs with filtering, searching, and pagination
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    const { category, search, tag, isPublished, sort, page = 1, limit = 50 } = req.query

    const query = {}

    // Filter by category
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(category, 'i') }
    }

    // Filter by publication status (default to published for public unless specified)
    if (isPublished !== undefined) {
      query.isPublished = isPublished === 'true'
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] }
    }

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { paragraphs: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ]
    }

    const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 }

    const blogs = await Blog.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Blog.countDocuments(query)

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: blogs,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single blog by slug or ID
// @route   GET /api/blogs/:slugOrId
// @access  Public
export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slugOrId } = req.params

    let blog = await Blog.findOne({ slug: slugOrId })

    if (!blog && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(slugOrId)
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog article not found',
      })
    }

    // Increment views count asynchronously
    blog.views = (blog.views || 0) + 1
    await blog.save({ validateBeforeSave: false })

    res.status(200).json({
      success: true,
      data: blog,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new blog article
// @route   POST /api/blogs
// @access  Private (Admin Only)
export const createBlog = async (req, res, next) => {
  try {
    const blogData = req.body

    // Ensure paragraphs is an array
    if (typeof blogData.paragraphs === 'string') {
      blogData.paragraphs = blogData.paragraphs
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean)
    }

    // Ensure tags is an array
    if (typeof blogData.tags === 'string') {
      blogData.tags = blogData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    }

    const blog = await Blog.create(blogData)

    res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog article created successfully',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update existing blog article
// @route   PUT /api/blogs/:id
// @access  Private (Admin Only)
export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Format paragraphs if passed as string
    if (typeof updateData.paragraphs === 'string') {
      updateData.paragraphs = updateData.paragraphs
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean)
    }

    // Format tags if passed as string
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog article not found',
      })
    }

    res.status(200).json({
      success: true,
      data: blog,
      message: 'Blog article updated successfully',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete blog article
// @route   DELETE /api/blogs/:id
// @access  Private (Admin Only)
export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params

    const blog = await Blog.findByIdAndDelete(id)

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog article not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Blog article deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Upload image file
// @route   POST /api/blogs/upload
// @access  Private (Admin Only)
export const uploadBlogImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file to upload',
      })
    }

    const fileUrl = `/uploads/${req.file.filename}`

    res.status(200).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      message: 'Image uploaded successfully',
    })
  } catch (error) {
    next(error)
  }
}
