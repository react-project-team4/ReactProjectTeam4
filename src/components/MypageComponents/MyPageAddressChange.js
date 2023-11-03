import styles from "../../css/MyPageCss/MyPageAddressChange.module.css";

const MyPageAddressChange = () => {
    return(
        <>
            <div className={styles.addressBox}>
                <div style={{width:'100%', height:'30%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{ width: '90%', height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <h3 style={{textAlign:'left'}}>배송지 이름</h3>
                    </div>
                </div>

                <div style={{ width: '100%', height: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '90%', height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        경상북도 칠곡군 지천면 금송로 60, 영진전문대학교 글로벌캠퍼스 기숙사
                    </div>
                </div>
            </div>

            <div className={styles.createAddressBox} onClick={()=>alert("배송지 추가")}>+ 배송지 추가</div>
        </>
    )
}

export default MyPageAddressChange