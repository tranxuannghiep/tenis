import { Modal } from '../ui/Modal';

interface LoginModalProps {
  loginForm: any;
  setLoginForm: (form: any) => void;
  onLogin: () => void;
  onClose: () => void;
  error?: string | null;
}

export function LoginModal({ loginForm, setLoginForm, onLogin, onClose, error }: LoginModalProps) {
  return (
    <Modal title="Admin Login" onClose={onClose}>
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
          <input 
            type="text" 
            value={loginForm.username}
            onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="admin"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>
        <button 
          onClick={onLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </div>
    </Modal>
  );
}
