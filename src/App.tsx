import { useContext, ReactElement } from 'react';
import { Viewer } from './components/Viewer';
import { DataFetcher } from './components/DataFetcher';
import Spinner from './components/Spinner';
import { StoreComponent, context } from './Store';

export function App() {
	const state = useContext(context)[0];

	return (
		<div className="w-full flex flex-row">
			{state.isLoading === true && (
				<div
					className="fixed w-screen min-h-screen top-0 left-0 flex items-center justify-center z-50  h-full"
					style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
				>
					<Spinner />
				</div>
			)}
			<div className="z-10 w-9/12 bg-indigo-200 min-h-full h-screen">
				<Viewer />
			</div>
			<div className="z-10 w-3/12">
				<DataFetcher />
			</div>
		</div>
	);
}

interface Props {
	children: ReactElement;
}

// We want to provide nice loading animation at the top level.
// So this wrapper simply allows App to use context state.
export function AppWrapper({ children }: Props) {
	return <StoreComponent>{children}</StoreComponent>;
}
