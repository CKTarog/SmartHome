const OffOverlay = () => {
    return(
        <div className='absolute inset-0 mt-20 z-10 flex flex-col bg-gray-700/70 md:place-content-center md:pt-0 pt-20 items-center'> 
          <h1 className="font-black md:text-8xl text-4xl uppercase">Systems Off</h1>
          <p className="font-light md:text-md text-sm opacity-50 m-1">Turn on systems to access Control Panel</p>
        </div>
    );
}
export default OffOverlay;