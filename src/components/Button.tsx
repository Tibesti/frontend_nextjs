import clsx from 'clsx';

export default function Button ({ 
    ...props
}:{
    type: "button" | "submit";
    isLoading: boolean;
    isValid: boolean;
    text: string;
    onClick?: () => void;
    className?: string;
}) {
    return(
        <button
            type={props.type}
            className={clsx(
                "text-center rounded-lg text-base font-semibold w-full py-2.5 flex text-white items-center justify-center relative gap-x-1",
                props.isValid ? "bg-green-500 block mx-auto cursor-pointer" : "cursor-not-allowed bg-gray-300",
                props.isLoading && "opacity-70",
                props.className,
            )}
            disabled={props.isLoading}
            onClick={props.onClick}
        >
            {props.text}
            {props.isLoading && <img src={"/white-loader.gif"} alt="loader" className='absolute top-[calc(50%-12px)] left-[calc(50%-12px)] w-[24px]' />}
        </button>
    )
}