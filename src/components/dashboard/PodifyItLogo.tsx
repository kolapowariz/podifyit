import { CircleStackIcon } from '@heroicons/react/24/outline';

export default function PodifyItLogo() {
  return (
    <div
      className={` flex flex-row items-center leading-none text-white`}
    >
      <CircleStackIcon className="h-12 w-12 rotate-[315deg]" />
      <p className="text-[34px]">PodifyIt</p>
    </div>
  );
}
