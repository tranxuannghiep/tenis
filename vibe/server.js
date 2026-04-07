// Fix for "SES Removing unpermitted intrinsics"
// Thay đổi cách áp dụng các kiểu định dạng không được hỗ trợ
const noteElement = document.createElement('div');
noteElement.classList.add('note');
noteElement.innerHTML = `
  <h3>${note.title}</h3>
  <p>${note.content}</p>
  <p>Created at: ${new Date(note.createdAt).toLocaleString()}</p>
  <button data-id="${note.id}" class="edit-btn">Edit</button>
  <button data-id="${note.id}" class="delete-btn">Delete</button>
`;

// Fix for "Failed to load resource: the server responded with a status of 500 (Internal Server Error)"
// Kiểm tra và sửa lỗi trong mã code phía máy chủ
try {
  // Mã code phía máy chủ để xử lý yêu cầu
  const notes = await getNotes();
  renderNotes(notes);
} catch (err) {
  console.error('Error loading notes:', err);
  // Thêm xử lý lỗi phù hợp, như hiển thị thông báo lỗi cho người dùng
}

// Fix for "Failed to load resource: the server responded with a status of 404 (Not Found)"
// Kiểm tra và sửa URL của tài nguyên
try {
  const response = await fetch('/api/notes');
  const notes = await response.json();
  renderNotes(notes);
} catch (err) {
  console.error('Error loading notes:', err);
  // Thêm xử lý lỗi phù hợp
}

// Fix for "Refused to apply style from 'http://localhost:3000/css/styles.css' because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled."
// Đảm bảo rằng máy chủ phục vụ tệp CSS với loại MIME chính xác
app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));
