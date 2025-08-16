"use client";

import Main from "@/components/ui/Main";
import React, { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPageTransactions } from "@/libs/action";
import Loading from "@/components/ui/Loading";
import { TransactionType } from "../types";
import { formatDate } from "../helpers/formatDate";
import formatCurrency from "../helpers/formatCurrency";
import Image from "next/image";
import PageButton from "@/components/ui/PageButton";

const transactionQueryOptions = (pageNumber: number, limit: number) =>
  queryOptions({
    queryKey: ["transactions", { pageNumber }],
    queryFn: () => getPageTransactions(pageNumber, limit),
  });

export default function page() {
  const [page, setPage] = useState<number>(1);

  const { data, isPending, error, refetch } = useQuery(
    transactionQueryOptions(page, 10)
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    if (page > 1) {
      queryClient.prefetchQuery(transactionQueryOptions(page - 1, 10));
    }
    queryClient.prefetchQuery(transactionQueryOptions(page + 1, 10));
  }, [page, queryClient]);

  if (error) return "Error occured while fetching " + error;

  const transaction = data?.data;

  return (
    <Main pageName="Transactions">
      <Container
        className={`${
          isPending
            ? "min-h-[60vh] flex items-center justify-center"
            : "flex flex-col gap-4 min-h-[60vh]"
        }`}
      >
        {isPending ? (
          <Loading />
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="text-sm  border-b-1 border-zinc-200 text-zinc-500">
                  <th className="text-left p-4 w-[50%] font-normal">
                    Recipient/Sender
                  </th>
                  <th className="text-left p-4 w-[20%] font-normal">
                    Category
                  </th>
                  <th className="text-left p-4 w-[20%] font-normal">
                    Transaction Date
                  </th>
                  <th className="text-right p-4 w-[10%] font-normal">Amount</th>
                </tr>
              </thead>

              <tbody>
                {transaction?.map((tr: TransactionType, index: number) => (
                  <tr
                    key={index}
                    className="text-sm border-b-1 last:border-b-0 border-zinc-200"
                  >
                    <td className="p-4 flex items-center gap-4">
                      <div className="w-8 overflow-hidden aspect-square rounded-full relative">
                        <Image
                          src={tr.avatar}
                          alt={tr.name}
                          fill
                          className="object-cover"
                        ></Image>
                      </div>
                      <p className="font-bold">{tr.name}</p>
                    </td>
                    <td className="p-4 text-zinc-500">{tr.category}</td>
                    <td className="p-4 text-zinc-500">{formatDate(tr.date)}</td>
                    <td className="p-4 text-right">
                      <p
                        className={`${
                          tr.amount > 0 ? "text-[#277d79]" : "text-black"
                        } font-bold`}
                      >
                        {formatCurrency(tr.amount)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <section
              className=" flex items-center justify-between
            "
            >
              <PageButton
                onClick={() => setPage((prev) => prev - 1)}
                active={page === 1 ? false : true}
                tag={"Prev"}
                page={page}
              />
              <div className="flex items-center gap-3">
                {Array.from({ length: data.totalPages }, (_, i) => (
                  <PageButton
                    key={`button-${i + 1}`}
                    tag={i + 1}
                    page={page}
                    onClick={() => setPage(i + 1)}
                  ></PageButton>
                ))}
              </div>

              <PageButton
                onClick={() => setPage((prev) => prev + 1)}
                active={page === data.totalPages ? false : true}
                tag={"Next"}
                page={page}
              />
            </section>
          </>
        )}
      </Container>
    </Main>
  );
}
