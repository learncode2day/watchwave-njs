import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { IoHeart, IoLogoGithub, IoMail } from 'react-icons/io5';
import Logo from './Logo';

const Footer = () => {
	return (
		<div className="z-30 w-full border-t-1 border-t-zinc-600 pb-24 pt-16 sm:py-8">
			<div className="fr mx-auto max-w-7xl justify-between px-8 sm:px-16 sm:pl-24">
				<div className="grid w-full gap-16 md:grid-cols-2 md:gap-8">
					<div className="fc size-full items-start gap-3">
						<div className="fr rounded-full bg-zinc-800 px-5 py-2">
							<Logo />
							<span className="text-2xl font-bold tracking-tighter">atchWave</span>
						</div>
						<p className="text-foreground-400">Watch your favourite shows and movies with WatchWave.</p>
					</div>
					<div className="fc size-full items-start gap-3 sm:items-end">
						<h4 className="text-xl text-white">Disclaimer</h4>
						<p className="text-foreground-400 sm:text-right">
							WatchWave does not host any files, it merely links to 3rd party services. Legal issues should be taken up with the file
							hosts and providers. WatchWave is not responsible for any media files shown by the video providers.
						</p>
					</div>
					<div className="fr justify-start gap-3">
						<Link target="blank" href="https://github.com/Lemirq/watchwave-njs">
							<Button isIconOnly radius="full" variant="ghost">
								<IoLogoGithub className="text-2xl" />
							</Button>
						</Link>
						<Link target="blank" href="mailto:519vihaansh@gmail.com">
							<Button isIconOnly radius="full" variant="ghost">
								<IoMail className="text-2xl" />
							</Button>
						</Link>
					</div>
					<div className="fr justify-start gap-3 text-foreground-400 sm:justify-end">
						<span className="inline-flex items-center justify-center gap-2">
							Made with <IoHeart /> by
						</span>
						<Link href="https://lemirq.github.io">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 145 125" fill="white">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M56.0583 56.7265L72.7693 28.9571L95.9812 28.937L56.0312 96.7368L0 0H23.2009L56.0583 56.7265Z"
									fill="white"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M74.3425 0.917236V20.945ZM74.3425 20.945H110.167L61.3707 104.972L72.9712 125L145 0.917236H74.3425"
									fill="white"
								/>
							</svg>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
