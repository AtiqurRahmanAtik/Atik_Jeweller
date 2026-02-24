const Mtitle = ({ title, middlecontent, rightcontent }) => {
    return (
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-5">
            <h2 className="text-2xl  font-semibold">{title}</h2>
            <div>
                {middlecontent}
            </div>
            <div className="">
                {rightcontent}
            </div>
        </div>
    );
};

export default Mtitle;