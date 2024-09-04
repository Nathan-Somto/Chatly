import H1 from "../ui/typo/H1";
import P from "../ui/typo/P";
import { Button } from "../ui/button";
import { AlertCircleIcon, MegaphoneIcon } from "lucide-react";

export default function ErrorFallback() {
  return (
    <div className="h-screen grid place-items-center">
    <div className="h-fit  mx-auto justify-center item-center max-w-[600px] border bg-red-100 dark:bg-red-200  border-red-400  text-red-700 px-4 py-6 rounded relative">
        <AlertCircleIcon size={120} className="text-destructive mb-4"/>
        <div>
            <H1 className="w-[80%] text-balance mb-5">Oops Something nasty went wrong!</H1>
            <P className="dark:text-red-800 text-red-500 mb-3 w-[90%]">
                Not to worry our engineers will handle it, just open your console and
                take a screenshot of the error and click the button below
            </P>
            <Button
            variant={'secondary'}
                onClick={() =>
                    window.open(
                        "https://www.github.com/nathan-somto/chatly/issues/new",
                        "__blank"
                    )
                }
            >
                <MegaphoneIcon className="mr-2"/> Report
            </Button>
        </div>
    </div>
    </div>
  );
}
