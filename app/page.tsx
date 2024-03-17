'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const memberId = '65f67e8484ded757907db6a8';

export default function Home() {
	const [fetchAgain, setFetchAgain] = useState(0);
	const [fetchState, setFetchState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const [books, setBooks] = useState<
		Array<{
			_id: string;
			bookName: string;
			numberOfCopies: number;
		}>
	>();

	useEffect(() => {
		setFetchState('loading');
		fetch('http://localhost:4000/books')
			.then(res => res.json())
			.then(resObj => {
				setBooks(resObj.data.books);
				setFetchState('success');
			});
	}, [fetchAgain]);

	const handleRent = (bookId: string) => {
		fetch(`http://localhost:4000/books/${bookId}/rent`, {
			method: 'POST',
			body: JSON.stringify({
				memberId: memberId,
				date: new Date()
			}),
			headers: {
				'Content-type': 'application/json'
			}
		}).then(() => setFetchAgain(fetchAgain + 1));
	};

	return (
		<div className="min-h-screen h-full bg-slate-300 text-black p-10 flex flex-col gap-5 items-center">
			<h1 className="font-bold text-3xl">Proven Club Library</h1>
			<div className="min-h-[500px] mt-5 min-w-[750px] max-w-[750px] border-2 border-solid border-black p-4">
				{fetchState === 'success' ? (
					<>
						{books &&
							books.map(book => (
								<div key={book._id} className="w-full border-b-2 border-solid border-slate-400 flex items-center justify-between">
									<h4 className="uppercase">{book.bookName}</h4>
									<span>Available Copies: {book.numberOfCopies}</span>

									<Dialog>
										<DialogTrigger disabled={!book.numberOfCopies} asChild>
											<p className={`hover:bg-slate-500 hover:transition-all p-2 ${book.numberOfCopies ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
												Rent it!
											</p>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>{book.bookName}</DialogTitle>
											</DialogHeader>
											<div className="flex items-center justify-between h-[50px]">
												<span>Available Copies: {book.numberOfCopies}</span>
												<Button disabled={book.numberOfCopies <= 0} onClick={() => handleRent(book._id)}>
													Rent It!
												</Button>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							))}
					</>
				) : (
					[...Array(5)].map(_ => (
						<div className="w-full m-2 pr-4 flex items-center justify-between">
							<Skeleton className="h-20 w-full" />
						</div>
					))
				)}
			</div>
		</div>
	);
}
