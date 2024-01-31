import Image from 'next/image';
import icon from '../../public/logo.svg';

export default function Logo() {
  return (
    <div className="rounded-full overflow-hidden">
      <Image width="50" height="50" src={icon} alt="logo" />
    </div>
  );
}
