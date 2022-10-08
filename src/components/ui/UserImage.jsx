import { LazyLoadImage } from 'react-lazy-load-image-component'

const UserImage = ({ username, publickey, classes }) => {
    return (
        <>
            <LazyLoadImage
                className={`rounded-full ${classes}`}
                alt={`${username}'s profile picture`}
                effect="blur"
                src={`https://node.deso.org/api/v0/get-single-profile-picture/${publickey}`}
            />
        </>
    )
}

export default UserImage