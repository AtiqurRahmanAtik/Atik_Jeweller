import { ColorRing } from "react-loader-spinner";

const MtableLoading = ({ data }) => {
  return (
    <div>
      {data ? (
        data.length === 0 ? (
          <div className="flex justify-center items-center w-full h-full py-28">
          
          </div>
        ) : (
          // Your logic to render data or table component
          <div>{/* Your table or content to render with the data */}</div>
        )
      ) : (
        <div className="flex justify-center items-center w-full h-full py-28">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      )}
    </div>
  );
};

export default MtableLoading;
