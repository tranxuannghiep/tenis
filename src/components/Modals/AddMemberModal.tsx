import { Modal } from '../ui/Modal';

interface AddMemberModalProps {
  memberName: string;
  setMemberName: (name: string) => void;
  onAdd: (name: string) => void;
  onClose: () => void;
}

export function AddMemberModal({ memberName, setMemberName, onAdd, onClose }: AddMemberModalProps) {
  return (
    <Modal title="Add New Member" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input 
            type="text" 
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter member name..."
          />
        </div>
        <button 
          onClick={() => {
            onAdd(memberName);
            setMemberName('');
            onClose();
          }}
          disabled={!memberName}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Add Member
        </button>
      </div>
    </Modal>
  );
}
