/**
 * Centralized Icon Components
 * All icons use currentColor for CSS color inheritance
 *
 * Usage:
 * import { PlusIcon, DocumentIcon } from "@/styles/icons";
 */

/** Plus Icon - Generic plus/add icon */
export const PlusIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path
      d="M10 4V16M4 10H16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Small Plus Icon - For compact buttons (13x13) */
export const PlusIconSmall = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path
      d="M6.5 1V12M1 6.5H12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Document Icon - File/document representation */
export const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M11.25 1.25H5C4.33696 1.25 3.70107 1.51339 3.23223 1.98223C2.76339 2.45107 2.5 3.08696 2.5 3.75V16.25C2.5 16.913 2.76339 17.5489 3.23223 18.0178C3.70107 18.4866 4.33696 18.75 5 18.75H15C15.663 18.75 16.2989 18.4866 16.7678 18.0178C17.2366 17.5489 17.5 16.913 17.5 16.25V7.5L11.25 1.25Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.25 1.25V7.5H17.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Document Check Icon - File with checkmark */
export const DocumentCheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M11.25 1.25H5C4.33696 1.25 3.70107 1.51339 3.23223 1.98223C2.76339 2.45107 2.5 3.08696 2.5 3.75V16.25C2.5 16.913 2.76339 17.5489 3.23223 18.0178C3.70107 18.4866 4.33696 18.75 5 18.75H15C15.663 18.75 16.2989 18.4866 16.7678 18.0178C17.2366 17.5489 17.5 16.913 17.5 16.25V7.5L11.25 1.25Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.25 1.25V7.5H17.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 12.5L9.16667 14.1667L12.5 10.8333"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Clock Icon - Time/pending indicator */
export const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 6V12L15.5 15.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Search Icon - Magnifying glass */
export const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle
      cx="7"
      cy="7"
      r="5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 14L11 11"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Grid Icon - Grid view toggle */
export const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect
      x="2"
      y="2"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect
      x="9"
      y="2"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect
      x="2"
      y="9"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect
      x="9"
      y="9"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
);

/** List Icon - List view toggle */
export const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 4H14M2 8H14M2 12H14"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Upload Icon - File upload indicator */
export const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M11.25 1.25H5C4.33696 1.25 3.70107 1.51339 3.23223 1.98223C2.76339 2.45107 2.5 3.08696 2.5 3.75V16.25C2.5 16.913 2.76339 17.5489 3.23223 18.0178C3.70107 18.4866 4.33696 18.75 5 18.75H15C15.663 18.75 16.2989 18.4866 16.7678 18.0178C17.2366 17.5489 17.5 16.913 17.5 16.25V7.5L11.25 1.25Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.25 1.25V7.5H17.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 14V10M10 10L8 12M10 10L12 12"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** File Upload Icon - Alias for UploadIcon (menu item) */
export const FileUploadIcon = UploadIcon;

/** Folder Upload Icon - Folder with upload arrow */
export const FolderUploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M2.5 5C2.5 4.17157 3.17157 3.5 4 3.5H7.17157C7.70201 3.5 8.21071 3.71071 8.58579 4.08579L9.41421 4.91421C9.78929 5.28929 10.298 5.5 10.8284 5.5H16C16.8284 5.5 17.5 6.17157 17.5 7V15C17.5 15.8284 16.8284 16.5 16 16.5H4C3.17157 16.5 2.5 15.8284 2.5 15V5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 13V9M10 9L8 11M10 9L12 11"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Folder Create Icon - Folder with plus sign */
export const FolderCreateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M2.5 5C2.5 4.17157 3.17157 3.5 4 3.5H7.17157C7.70201 3.5 8.21071 3.71071 8.58579 4.08579L9.41421 4.91421C9.78929 5.28929 10.298 5.5 10.8284 5.5H16C16.8284 5.5 17.5 6.17157 17.5 7V15C17.5 15.8284 16.8284 16.5 16 16.5H4C3.17157 16.5 2.5 15.8284 2.5 15V5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 8V14M7 11H13"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Ellipsis Icon - Vertical three dots menu */
export const EllipsisIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="6" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="18" r="1.5" fill="currentColor" />
  </svg>
);

/** Chevron Down Icon - Dropdown arrow */
export const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Arrow Up Icon - Send/submit arrow */
export const ArrowUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 13V3M8 3L4 7M8 3L12 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Logo Icon - Brand logo with gradient */
export const LogoIcon = () => (
  <svg width="42" height="53" viewBox="0 0 42 53" fill="none">
    <path d="M21 0L0 12V40L21 52L42 40V12L21 0Z" fill="url(#logo-gradient)" />
    <path
      d="M21 10L8 17.5V32.5L21 40L34 32.5V17.5L21 10Z"
      fill="white"
      fillOpacity="0.3"
    />
    <path
      d="M21 16L12 21V31L21 36L30 31V21L21 16Z"
      fill="white"
      fillOpacity="0.5"
    />
    <defs>
      <linearGradient
        id="logo-gradient"
        x1="0"
        y1="0"
        x2="42"
        y2="52"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2EC4A0" />
        <stop offset="1" stopColor="#0066FF" />
      </linearGradient>
    </defs>
  </svg>
);

/** File Icon Small - 16x16 file icon for grid cells */
export const FileIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M9 1H4C3.44772 1 3 1.44772 3 2V14C3 14.5523 3.44772 15 4 15H12C12.5523 15 13 14.5523 13 14V5L9 1Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 1V5H13"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Folder Icon Small - 16x16 folder icon for grid cells */
export const FolderIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 4C2 3.44772 2.44772 3 3 3H5.58579C5.851 3 6.10536 3.10536 6.29289 3.29289L7.70711 4.70711C7.89464 4.89464 8.149 5 8.41421 5H13C13.5523 5 14 5.44772 14 6V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V4Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Edit Icon - Pencil icon for edit action */
export const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M14.1667 2.5C14.3856 2.28113 14.6454 2.10752 14.9314 1.98906C15.2173 1.87061 15.5238 1.80965 15.8333 1.80965C16.1428 1.80965 16.4493 1.87061 16.7353 1.98906C17.0212 2.10752 17.281 2.28113 17.5 2.5C17.7189 2.71887 17.8925 2.97871 18.0109 3.26465C18.1294 3.5506 18.1904 3.85713 18.1904 4.16667C18.1904 4.4762 18.1294 4.78273 18.0109 5.06868C17.8925 5.35462 17.7189 5.61446 17.5 5.83333L6.25 17.0833L1.66667 18.3333L2.91667 13.75L14.1667 2.5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Move Icon - Folder move icon */
export const MoveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M2.5 4C2.5 3.17157 3.17157 2.5 4 2.5H7.17157C7.70201 2.5 8.21071 2.71071 8.58579 3.08579L9.41421 3.91421C9.78929 4.28929 10.298 4.5 10.8284 4.5H16C16.8284 4.5 17.5 5.17157 17.5 6V14C17.5 14.8284 16.8284 15.5 16 15.5H4C3.17157 15.5 2.5 14.8284 2.5 14V4Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 8V12M10 12L8 10M10 12L12 10"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Trash Icon - Delete icon */
export const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M2.5 5H17.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.8333 5V16.6667C15.8333 17.5 15 18.3333 14.1667 18.3333H5.83333C5 18.3333 4.16667 17.5 4.16667 16.6667V5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.66667 5V3.33333C6.66667 2.5 7.5 1.66667 8.33333 1.66667H11.6667C12.5 1.66667 13.3333 2.5 13.3333 3.33333V5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.33333 9.16667V14.1667"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6667 9.16667V14.1667"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** More Vertical Icon - Vertical 3 dots for action menu (16x16) */
export const MoreVerticalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="3" r="1" fill="currentColor" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="8" cy="13" r="1" fill="currentColor" />
  </svg>
);

/** Sort Icon - Sort arrows for column headers */
export const SortIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 3L11 6H5L8 3Z"
      fill="currentColor"
    />
    <path
      d="M8 13L5 10H11L8 13Z"
      fill="currentColor"
    />
  </svg>
);

/** Status Dot - Small colored dot for status indicators */
export const StatusDot = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
    <circle cx="3" cy="3" r="3" fill={color} />
  </svg>
);

/** Chevron Right Icon - For breadcrumb separator */
export const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M6 12L10 8L6 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Restore Icon - Undo/restore from trash */
export const RestoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M3.33333 3.33333V7.5H7.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.24999 12.5C5.7784 13.8239 6.73614 14.9265 7.97071 15.6345C9.20528 16.3425 10.6457 16.6146 12.0578 16.4063C13.47 16.1979 14.7713 15.5215 15.7553 14.4858C16.7393 13.4502 17.3486 12.1155 17.4845 10.6948C17.6204 9.27411 17.2749 7.85044 16.5028 6.65547C15.7308 5.4605 14.5777 4.56224 13.2285 4.1034C11.8793 3.64456 10.4167 3.65197 9.07218 4.12447C7.72768 4.59697 6.58337 5.5071 5.82333 6.71"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Trash Empty Icon - Empty trash/recycle bin */
export const TrashEmptyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M2.5 5H17.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.8333 5V16.6667C15.8333 17.5 15 18.3333 14.1667 18.3333H5.83333C5 18.3333 4.16667 17.5 4.16667 16.6667V5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.66667 5V3.33333C6.66667 2.5 7.5 1.66667 8.33333 1.66667H11.6667C12.5 1.66667 13.3333 2.5 13.3333 3.33333V5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Calendar Icon - Date picker icon */
export const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect
      x="2"
      y="3"
      width="12"
      height="11"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 1V3"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 1V3"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 7H14"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Refresh Icon - Reset/refresh action */
export const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2.66667 2.66667V6H6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.3333 13.3333V10H10"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.9333 5.99999C11.6844 5.20489 11.2246 4.49225 10.6024 3.93667C9.98026 3.38109 9.21857 3.00346 8.39946 2.84436C7.58034 2.68526 6.73453 2.75073 5.94904 3.03372C5.16355 3.3167 4.46747 3.80674 3.93333 4.45333L2.66667 6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.06667 10C4.31556 10.7951 4.77539 11.5078 5.39757 12.0633C6.01976 12.6189 6.78144 12.9965 7.60056 13.1556C8.41968 13.3147 9.26548 13.2493 10.051 12.9663C10.8365 12.6833 11.5325 12.1933 12.0667 11.5467L13.3333 10"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
