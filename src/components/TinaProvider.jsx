import { TinaEditProvider } from "tinacms/dist/edit-state"

const TinaProvider = ({ children }) => {
    return (
        <TinaEditProvider
            editMode={
                <TinaEditProvider.Provider
                    value={{
                        isEditing: true,
                        setIsEditing: () => { },
                    }}
                >
                    {children}
                </TinaEditProvider.Provider>
            }
        >
            <TinaEditProvider.Provider
                value={{
                    isEditing: false,
                    setIsEditing: () => { },
                }}
            >
                {children}
            </TinaEditProvider.Provider>
        </TinaEditProvider>
    )
}

export default TinaProvider
