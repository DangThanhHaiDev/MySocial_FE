import { useState } from "react";
import ReportModal from "../../Post/ReportModal";

const CommentCard = ({ comment, ...props }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);

  return (
    <div>
      <div className="relative inline-block">
        <button onClick={() => setShowMenu(!showMenu)} className="px-2 py-1 text-xl">⋮</button>
        {showMenu && (
          <div className="absolute right-0 bg-white shadow rounded z-10">
            <button
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => { setShowReport(true); setShowMenu(false); }}
            >
              Báo cáo bình luận
            </button>
          </div>
        )}
      </div>
      {showReport && (
        <ReportModal
          type="COMMENT"
          targetId={comment.id}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}; 