import { LazyLoadImage } from 'react-lazy-load-image-component'

const UserImage = ({ username, profile, classes }) => {
    return (
        <>
            <LazyLoadImage
                className={`rounded-full ${classes}`}
                alt={`${username}'s profile picture`}
                effect="blur"
                src={profile?.ExtraData?.LargeProfilePicURL || `https://node.deso.org/api/v0/get-single-profile-picture/${profile?.PublicKeyBase58Check}`}
            />
        </>
    )
}

export default UserImage